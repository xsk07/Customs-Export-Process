CREATE TABLE BATENANTINFO (
	tenantGuid uniqueidentifier,
	tenantName VARCHAR(256) NOT NULL,
	shardMap VARCHAR(256) NOT NULL
);
CREATE CLUSTERED INDEX BATENANTINFO_IDX ON BATENANTINFO (tenantGuid);
GO
CREATE TABLE BASHARDLETINFO (
	shardLetGuid uniqueidentifier,
	tenantGuid uniqueidentifier NULL,
	shardLetName NVARCHAR(256) NOT NULL,
	shardLetSize BIGINT NULL,
	creationDate datetime NULL CONSTRAINT BASHARDLETINFO_DF DEFAULT (getdate()),
	sizeLastUpdatedDate datetime NULL,
	lastAccessDate datetime NULL
);
CREATE CLUSTERED INDEX BASHARDLETINFO_IDX ON BASHARDLETINFO (shardLetGuid);
CREATE INDEX BASHARDLETINFO_IDX1 ON BASHARDLETINFO (tenantGuid);
CREATE TABLE [dbo].[BACATALOGDEFINITIONS](
	[hashValue] [varchar](256) NOT NULL,
	[objectDefinition] [nvarchar](max) NOT NULL,
) 
CREATE UNIQUE NONCLUSTERED INDEX BACATALOGDEFINITIONS_IDX ON BACATALOGDEFINITIONS (hashValue);
GO
CREATE TYPE ShardLetInfoType AS TABLE (
	shardLetGuid uniqueidentifier,
	shardLetSize BIGINT NULL
);
GO
CREATE PROCEDURE [dbo].[spBA_SQL_ShardLetInfoMerge]
@SharLetInfoList ShardLetInfoType READONLY
AS
BEGIN
	SET NOCOUNT ON;
			 
	MERGE BASHARDLETINFO ShardLetInfo
	USING @SharLetInfoList Tmp ON Tmp.shardLetGuid = ShardLetInfo.shardLetGuid
	WHEN MATCHED THEN
		UPDATE SET	[shardLetSize]		 = Tmp.shardLetSize,           
					[sizeLastUpdatedDate]   = GETDATE();      	
END
GO
CREATE VIEW VW_TENANT_INFO
AS 
(
	SELECT P.shardMap,P.tenantGuid,P.tenantName,MAX(D.lastAccessDate) AS lastAccessDate,SUM(D.shardLetSize) AS tenantSize,COUNT(D.shardLetGuid) AS TotalShardlets
	FROM BATENANTINFO P LEFT JOIN BASHARDLETINFO D ON P.tenantGuid = D.tenantGuid
	GROUP BY P.shardMap,P.tenantGuid,P.tenantName
);
GO
CREATE PROCEDURE [dbo].[spBA_SQL_SetShardMappingGlobal]
                                               @shardMapName nvarchar(50),
                                               @databaseName nvarchar(128),
                                               @mappingId UNIQUEIDENTIFIER,
                                               @minValue varbinary(128),
                                               @lockOwnerId UNIQUEIDENTIFIER,
                                               @tenantId UNIQUEIDENTIFIER,
                                               @tenantName VARCHAR(256),
                                               @shardLetGuid UNIQUEIDENTIFIER,
                                               @shardLetName VARCHAR(256),
                                               @lastAccessDate DATETIME,
                                               @insertShardLet bit
AS
declare @shardMapId UNIQUEIDENTIFIER
declare @shardId UNIQUEIDENTIFIER
declare @errorNumber int
declare @errorMessage varchar(max)

BEGIN TRANSACTION
                BEGIN TRY
                               IF (@insertShardLet = 1)
                               BEGIN
                                               IF EXISTS (SELECT top 1 * FROM BATENANTINFO WHERE tenantGuid = @tenantId)
                                               BEGIN
                                                               IF NOT EXISTS (SELECT top 1 * FROM BASHARDLETINFO WHERE shardLetGuid = @shardLetGuid)
                                                               BEGIN
                                                                              INSERT INTO BASHARDLETINFO (shardLetGuid, tenantGuid, shardLetName, lastAccessDate) values (@shardLetGuid, @tenantId, @shardLetName, @lastAccessDate) 
                                                               END
                                               END
                                               ELSE
                                               BEGIN
                                                               INSERT INTO BATENANTINFO (tenantGuid, tenantName, shardMap) values (@tenantId, @tenantName, @shardMapName)
                                                               INSERT INTO BASHARDLETINFO (shardLetGuid, tenantGuid, shardLetName, lastAccessDate) values (@shardLetGuid, @tenantId, @shardLetName, @lastAccessDate)
                                               END
                               END

                               SELECT @shardMapId = ShardMapId FROM __ShardManagement.ShardMapsGlobal WHERE Name = @shardMapName

                               SELECT @shardId = ShardId FROM __ShardManagement.ShardsGlobal WHERE DataBaseName = @databaseName

                               INSERT INTO __ShardManagement.ShardMappingsGlobal (MappingId, Readable, ShardId, ShardMapId, MinValue, Status, LockOwnerId) values ( @mappingId, 1, @shardId, @shardMapId, @minValue, 1, @lockOwnerId)
                END TRY
                BEGIN CATCH
                               SELECT  @errorNumber = ERROR_NUMBER(), @errorMessage = ERROR_MESSAGE();
                               RAISERROR ('Caught exception: %d: %s', 16, 1, @errorNumber, @errorMessage);
                END CATCH
COMMIT TRANSACTION;


GO
CREATE PROCEDURE [dbo].[spBA_SQL_GetInfoTenants]
            @shardLetInfoType ShardLetInfoType READONLY,
            @pageIni INT = 0,
            @cantRows INT = 1,
            @searchName VARCHAR(256) = NULL,
			@columnOrder VARCHAR(16) = NULL,
			@typeOrder VARCHAR(8)
	AS
	BEGIN
	
		DECLARE @sql NVARCHAR(3000)
             
             SELECT tenantGuid INTO #tmpTenantInfo FROM BASHARDLETINFO WHERE shardLetGuid IN (SELECT DISTINCT(shardLetGuid) FROM @shardLetInfoType) GROUP BY tenantGuid;
           
             
             SET @sql = 'select tenantGuid, tenantName, tenantSize, lastAccessDate, (SELECT COUNT(*) FROM VW_TENANT_INFO WHERE tenantGuid IN ( SELECT tenantGuid FROM #tmpTenantInfo )) AS totalRows, totalShardlets from VW_TENANT_INFO  
             WHERE tenantGuid IN ( SELECT tenantGuid FROM #tmpTenantInfo )'
             
             IF (@searchName IS NOT NULL)
             BEGIN
                    SET @sql =    @sql + ' AND tenantName LIKE ''%' + @searchName +  '%'''
             END    
             
             SET @sql =  CASE @columnOrder 
				WHEN 'Date' THEN  @sql + ' ORDER BY lastAccessDate '     
				WHEN 'Size' THEN   @sql + ' ORDER BY tenantSize '  
				ELSE  @sql + ' ORDER BY tenantName '  
             END
             SET @sql =    @sql + @typeOrder
			 SET @sql =    @sql + ' OFFSET ' + CAST(@pageIni AS VARCHAR) + ' ROWS FETCH NEXT ' + CAST(@cantRows AS VARCHAR) + ' ROWS ONLY '
             
             EXEC sp_executesql  @sql

	END
GO
CREATE  PROCEDURE [dbo].[spBA_SQL_GetInfoTenants_DB1]
            @shardLetInfoType ShardLetInfoType READONLY,
            @pageIni INT = 0,
            @cantRows INT = 1,
            @searchName VARCHAR(256) = NULL,
                    @columnOrder VARCHAR(16) = NULL,
                    @typeOrder VARCHAR(8)
       AS
       BEGIN
       
             DECLARE @sql NVARCHAR(3000)
             
             SELECT tenantGuid INTO #tmpTenantInfo FROM BASHARDLETINFO WHERE shardLetGuid IN (SELECT DISTINCT(shardLetGuid) FROM @shardLetInfoType) GROUP BY tenantGuid;
           
             
             SET @sql = 'select tenantGuid, tenantName, tenantSize, lastAccessDate, (SELECT COUNT(*) FROM VW_TENANT_INFO WHERE tenantGuid IN ( SELECT tenantGuid FROM #tmpTenantInfo )) AS totalRows, totalShardlets from VW_TENANT_INFO  
             WHERE tenantGuid IN ( SELECT tenantGuid FROM #tmpTenantInfo )'
             
             IF (@searchName IS NOT NULL)
             BEGIN
                    SET @sql =    @sql + ' AND tenantName LIKE ''%' + @searchName +  '%'''
             END    
             
             SET @sql =  CASE @columnOrder 
				WHEN 'Date' THEN  @sql + ' ORDER BY lastAccessDate '     
				WHEN 'Size' THEN   @sql + ' ORDER BY tenantSize '  
				ELSE  @sql + ' ORDER BY tenantName '  
             END
             SET @sql =    @sql + @typeOrder
			SET @sql =    @sql + ' OFFSET ' + CAST(@pageIni AS VARCHAR) + ' ROWS FETCH NEXT ' + CAST(@cantRows AS VARCHAR) + ' ROWS ONLY '
             
             EXEC sp_executesql  @sql

       END
GO
CREATE PROCEDURE [dbo].[spBA_SQL_SetShardMappingGlobal_DB1]
			@shardMapName nvarchar(50),
			@databaseName nvarchar(128),
			@mappingId UNIQUEIDENTIFIER,
			@minValue varbinary(128),
			@lockOwnerId UNIQUEIDENTIFIER,
			@tenantId UNIQUEIDENTIFIER,
			@tenantName VARCHAR(256),
			@shardLetGuid UNIQUEIDENTIFIER,
			@shardLetName VARCHAR(256),
			@lastAccessDate DATETIME,
			@insertShardLet bit,
			@TransaccionRequired BIT
AS
declare @shardMapId UNIQUEIDENTIFIER
declare @shardId UNIQUEIDENTIFIER
declare @errorNumber int
declare @errorMessage varchar(max)

IF @TransaccionRequired = 1
BEGIN
	SET TRANSACTION ISOLATION LEVEL SNAPSHOT
	BEGIN TRANSACTION
END

	BEGIN TRY
		IF (@insertShardLet = 1)
		BEGIN
			IF EXISTS (SELECT top 1 * FROM BATENANTINFO WHERE tenantGuid = @tenantId)
			BEGIN
				IF NOT EXISTS (SELECT top 1 * FROM BASHARDLETINFO WHERE shardLetGuid = @shardLetGuid)
				BEGIN
					INSERT INTO BASHARDLETINFO (shardLetGuid, tenantGuid, shardLetName, lastAccessDate) values (@shardLetGuid, @tenantId, @shardLetName, @lastAccessDate) 
				END
			END
			ELSE
			BEGIN
				INSERT INTO BATENANTINFO (tenantGuid, tenantName, shardMap) values (@tenantId, @tenantName, @shardMapName)
				INSERT INTO BASHARDLETINFO (shardLetGuid, tenantGuid, shardLetName, lastAccessDate) values (@shardLetGuid, @tenantId, @shardLetName, @lastAccessDate)
			END
		END

		SELECT @shardMapId = ShardMapId FROM __ShardManagement.ShardMapsGlobal WHERE Name = @shardMapName

		SELECT @shardId = ShardId FROM __ShardManagement.ShardsGlobal WHERE DataBaseName = @databaseName

		INSERT INTO __ShardManagement.ShardMappingsGlobal (MappingId, Readable, ShardId, ShardMapId, MinValue, Status, LockOwnerId) values ( @mappingId, 1, @shardId, @shardMapId, @minValue, 1, @lockOwnerId)

	END TRY
	BEGIN CATCH
		SELECT  @errorNumber = ERROR_NUMBER(), @errorMessage = ERROR_MESSAGE();
		RAISERROR ('Caught exception: %d: %s', 16, 1, @errorNumber, @errorMessage) ;
	END CATCH
IF @TransaccionRequired = 1
	COMMIT TRANSACTION;
GO