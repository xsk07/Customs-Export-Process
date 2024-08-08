DECLARE @iBuild Int
DECLARE @iCurBuild INT

SELECT @iCurBuild = BAValue 
FROM BizAgiInfo
WHERE BAInfo = 'Build'

/* Insert Build Field in BizAgiInfo */
IF (@iCurBuild IS NULL)
BEGIN
	INSERT INTO BizAgiInfo 
	VALUES ('Build', 0)

	SET @iCurBuild = 0
END

PRINT('Detected Build on DB: ' + convert(varchar,@iCurBuild))

/****************** DBBuild Template ****************/
/*
SET @iBuild		= <DBBuild_ID>
IF (@iCurBuild < @iBuild) 
BEGIN
	PRINT('BEGIN: Build <DBBuild_ID>')
	
	/*DBBuild Content...*/

	/*Update DBBuild property on BizAgiInfo*/
	UPDATE BizAgiInfo 
	SET BAValue = @iBuild
	WHERE BAInfo = 'Build'

	PRINT('END: Build <DBBuild_ID>')
END
ELSE
BEGIN
	PRINT('Build <DBBuild_ID> not applied on DB')
END
*/
/****************** END:DBBuild Template *************/

SET @iBuild	= 1
IF (@iCurBuild < @iBuild) 
BEGIN
	PRINT('BEGIN: Build 1')
	
	PRINT ('BEGIN: UPDATE STORED PROCEDURE spBA_SQL_ImportPackage')
	EXEC('ALTER PROCEDURE spBA_SQL_ImportPackage
            @IEObjectsTable IEObjectsTable READONLY ,
            @IEReferencesTable IEReferencesTable READONLY,
			@IEIndexesTable IEIndexesTable READONLY , 
            @IDTagsTable IETagsTable READONLY
		AS
		BEGIN
		SET NOCOUNT ON;		
		SET TRANSACTION ISOLATION LEVEL SNAPSHOT
		BEGIN TRANSACTION
	
			DELETE FROM BABIZAGICATALOG WHERE rootObject IN (SELECT DISTINCT(rootObject) FROM @IEObjectsTable);
		
			INSERT INTO BABIZAGICATALOG (guidObject,guidObjectParent,objName,objContent,objType,objTypeName,deployOnParent,modifiedDate,
					   modifiedByUser,mtdVersion,rootObject,changeSetId,objContentResolved,deleted,contentFormat)
			SELECT 	   guidObject,guidObjectParent,objName,objContent,objType,objTypeName,deployOnParent,modifiedDate,modifiedByUser,
					   mtdVersion,rootObject,changeSetId,objContentResolved,deleted,contentFormat
			FROM @IEObjectsTable;

			DELETE FROM BACATALOGREFERENCE WHERE rootObject IN (SELECT DISTINCT(rootObject) FROM @IEObjectsTable);
			
			INSERT INTO BACATALOGREFERENCE(rootObject, guidPointer,guidObjectRef,guidObjectTarget,deleted)
			SELECT rootObject, guidPointer, guidObjectRef ,guidObjectTarget ,deleted FROM @IEReferencesTable;
			
			DELETE FROM BACATALOGINDEXEDOBJECTS WHERE rootObject IN (SELECT DISTINCT(rootObject) FROM @IEObjectsTable);
			
			INSERT INTO BACATALOGINDEXEDOBJECTS (rootObject, name,sourceGuid,targetGuid,deleted)
			SELECT rootObject,name,sourceGuid,targetGuid,deleted FROM @IEIndexesTable;
			
			DELETE FROM BATAGVALUE WHERE rootObject IN (SELECT DISTINCT(rootObject) FROM @IEObjectsTable);
			
			INSERT INTO BATAGVALUE (rootObject, tagType, tagName ,taggedObject ,value ,deleted)
			SELECT rootObject, tagType, tagName ,taggedObject ,value ,deleted FROM @IDTagsTable;
	
		COMMIT;					
	END')
	PRINT ('END: UPDATE STORED PROCEDURE spBA_SQL_ImportPackage')

	UPDATE BizAgiInfo 
	SET BAValue = @iBuild
	WHERE BAInfo = 'Build'

	PRINT('END: Build 1')
END
ELSE
BEGIN
	PRINT('Build 1 not applied on DB')
END

SET @iBuild	= 2
IF (@iCurBuild < @iBuild) 
BEGIN
	PRINT('BEGIN: Build 2')
	
	PRINT ('BEGIN: CREATE INDEXES ON CATALOG TABLES USING DELETED ATTRIBUTE')
	CREATE NONCLUSTERED INDEX BABIZAGICATALOG_IDX3 ON BABIZAGICATALOG (deleted)
	CREATE NONCLUSTERED INDEX BACATALOGINDEXEDOBJECTS_IDX4 ON BACATALOGINDEXEDOBJECTS (deleted)
	CREATE NONCLUSTERED INDEX BATAGVALUE_IDX2 ON BATAGVALUE (deleted)
	PRINT ('END: CREATE INDEXES ON CATALOG TABLES USING DELETED ATTRIBUTE')

	PRINT ('BEGIN: CREATE STORED PROCEDURE spBA_SQL_CleanCatalog')
	EXEC('CREATE PROCEDURE spBA_SQL_CleanCatalog
		AS
		BEGIN
		SET NOCOUNT ON;		
		SET TRANSACTION ISOLATION LEVEL SNAPSHOT
		DECLARE @Result AS BIT = 0
		BEGIN TRANSACTION
		
			DELETE TOP(500) babizagicatalog
			WHERE rootObject IN(SELECT TOP (10) rootObject FROM babizagicatalog WHERE deleted = 1 GROUP BY rootObject ) AND deleted = 1

			DELETE TOP(500) batagvalue
			WHERE rootObject IN(SELECT TOP (10) rootObject FROM babizagicatalog WHERE deleted = 1 GROUP BY rootObject ) AND deleted = 1

			DELETE TOP(500) bacatalogindexedobjects
			WHERE rootObject IN(SELECT TOP (10) rootObject FROM babizagicatalog WHERE deleted = 1 GROUP BY rootObject ) AND deleted = 1

			IF EXISTS (SELECT TOP (1) guidobject from babizagicatalog where deleted = 1) SET @Result = 1
			IF EXISTS (SELECT TOP (1) taggedObject from batagvalue where deleted = 1) SET @Result = 1
			IF EXISTS (SELECT TOP (1) targetGuid from bacatalogindexedobjects where deleted = 1) SET @Result = 1

			SELECT @Result
			
		COMMIT;					
	END')
	PRINT ('END: CREATE STORED PROCEDURE spBA_SQL_CleanCatalog')

	UPDATE BizAgiInfo 
	SET BAValue = @iBuild
	WHERE BAInfo = 'Build'

	PRINT('END: Build 2')
END
ELSE
BEGIN
	PRINT('Build 2 not applied on DB')
END

SET @iBuild	= 3
IF (@iCurBuild < @iBuild) 
BEGIN
	PRINT('BEGIN: Build 3')

	PRINT ('BEGIN: CREATE STORED PROCEDURE spBA_SQL_SetShardMappingLocal')
	EXEC('CREATE PROCEDURE [dbo].[spBA_SQL_SetShardMappingLocal]
				 @shardMapName nvarchar(50),
				 @databaseName nvarchar(128),
				 @mappingId UNIQUEIDENTIFIER,
				 @minValue varbinary(128),
				 @lockOwnerId UNIQUEIDENTIFIER
	AS
	BEGIN
	declare @shardMapId UNIQUEIDENTIFIER
	declare @shardId UNIQUEIDENTIFIER
	declare @errorNumber int
	declare @errorMessage varchar(max)
		BEGIN TRY

			SELECT @shardMapId = ShardMapId FROM __ShardManagement.ShardMapsLocal WHERE Name = @shardMapName

			SELECT @shardId = ShardId FROM __ShardManagement.ShardsLocal WHERE DataBaseName = @databaseName
		
			INSERT INTO __ShardManagement.ShardMappingsLocal (MappingId, ShardId, ShardMapId, MinValue, Status, LockOwnerId) values (@mappingId, @shardId, @shardMapId, @minValue, 1, @lockOwnerId)

		END TRY
		BEGIN CATCH
			SELECT  @errorNumber = ERROR_NUMBER(), @errorMessage = ERROR_MESSAGE();
			RAISERROR (''Caught exception: %d: %s'', 16, 1, @errorNumber, @errorMessage); 
		END CATCH
	END')	
	PRINT ('END: CREATE STORED PROCEDURE spBA_SQL_SetShardMappingLocal')

	UPDATE BizAgiInfo 
	SET BAValue = @iBuild
	WHERE BAInfo = 'Build'

	PRINT('END: Build 3')
END
ELSE
BEGIN
	PRINT('Build 3 not applied on DB')
END

SET @iBuild	= 4
IF (@iCurBuild < @iBuild) 
BEGIN
	PRINT('BEGIN: Build 4')

	PRINT ('BEGIN: CREATE STORED PROCEDURE spBA_SQL_UpdateRefsAndContents_DB4')
	EXEC('CREATE PROCEDURE [dbo].[spBA_SQL_UpdateRefsAndContents_DB4]
		@RefsTable ReferencesTable READONLY,
		@ContentsTable NewContentsTable  READONLY
		AS
		BEGIN
			SET NOCOUNT ON;
		
			SET TRANSACTION ISOLATION LEVEL SNAPSHOT
			BEGIN TRANSACTION	 
		
			MERGE BABIZAGICATALOG BizagiCatalog
			USING @ContentsTable Tmp ON Tmp.rootObject = BizagiCatalog.rootObject AND Tmp.guidObject = BizagiCatalog.guidObject
			WHEN MATCHED THEN UPDATE SET objContent = Tmp.objContentExpanded;
			
			MERGE BACATALOGREFERENCE BizagiCatalogReference
			USING @RefsTable Tmp ON Tmp.rootObject = BizagiCatalogReference.rootObject AND Tmp.guidObjectRef = BizagiCatalogReference.guidObjectRef AND Tmp.guidObjectTarget = BizagiCatalogReference.guidObjectTarget
			WHEN MATCHED THEN UPDATE SET guidPointer = Tmp.guidPointer
			WHEN NOT MATCHED THEN
				INSERT (rootObject,guidPointer, guidObjectRef, guidObjectTarget) VALUES(
					Tmp.rootObject, Tmp.guidPointer, Tmp.guidObjectRef, Tmp.guidObjectTarget);
	
			COMMIT
						
		END')	
	PRINT ('END: ALTER STORED PROCEDURE spBA_SQL_UpdateRefsAndContents')

	PRINT ('BEGIN: ALTER STORED PROCEDURE spBA_SQL_CleanCatalog')

	EXEC('CREATE PROCEDURE [dbo].[spBA_SQL_CleanCatalog_DB4]
			AS
			BEGIN
			SET NOCOUNT ON;		
			SET TRANSACTION ISOLATION LEVEL SNAPSHOT
			DECLARE @Result AS BIT = 0
			BEGIN TRANSACTION
		    
				CREATE TABLE #CatalogObjects
				(
					rootObject uniqueidentifier
				)
			
				INSERT INTO #CatalogObjects
				SELECT TOP(500) rootObject from babizagicatalog
				WHERE deleted = 1 GROUP BY rootObject
			
				DELETE FROM batagvalue
				WHERE rootObject IN(SELECT rootObject FROM #CatalogObjects) AND deleted = 1
			
				DELETE FROM bacatalogindexedobjects
				WHERE rootObject IN(SELECT rootObject FROM #CatalogObjects) AND deleted = 1
			
				DELETE FROM bacatalogreference
				WHERE rootObject IN(SELECT rootObject FROM #CatalogObjects) AND deleted = 1
			
				DELETE FROM babizagicatalog
				WHERE rootObject IN(SELECT rootObject FROM #CatalogObjects) AND deleted = 1
			
				DROP TABLE #CatalogObjects

				IF EXISTS (SELECT TOP (1) guidobject from babizagicatalog where deleted = 1) SET @Result = 1
				IF EXISTS (SELECT TOP (1) taggedObject from batagvalue where deleted = 1) SET @Result = 1
				IF EXISTS (SELECT TOP (1) targetGuid from bacatalogindexedobjects where deleted = 1) SET @Result = 1
				IF EXISTS (SELECT TOP (1) guidObjectRef from bacatalogreference where deleted = 1) SET @Result = 1

				SELECT @Result
			
			COMMIT;	
							
		END')

	PRINT ('END: ALTER STORED PROCEDURE spBA_SQL_CleanCatalog')

	UPDATE BizAgiInfo 
	SET BAValue = @iBuild
	WHERE BAInfo = 'Build'

	PRINT('END: Build 4')
END
ELSE
BEGIN
	PRINT('Build 4 not applied on DB')
END

SET @iBuild	= 5
IF (@iCurBuild < @iBuild) 
BEGIN
	PRINT('BEGIN: Build 5')

	PRINT ('BEGIN: CREATE STORED PROCEDURE spBA_SQL_BizagiCatalogMerge_DB5')

	EXEC('CREATE PROCEDURE [dbo].[spBA_SQL_BizagiCatalogMerge_DB5]
			@ObjectCatalog BizagiCatalogType READONLY,
			@ObjectTags TagValueType READONLY,
			@ObjectIndexes CatalogIndexedObjectsType READONLY,
			@RootObject uniqueidentifier = NULL,
			@ChangeSetId INT = 0			
			AS
			DECLARE @Deleted int		
			SET @Deleted = 1;
			SET NOCOUNT ON;
			SET TRANSACTION ISOLATION LEVEL SNAPSHOT
			BEGIN TRANSACTION
				MERGE BABIZAGICATALOG AS BizagiCatalog
				USING @ObjectCatalog Tmp ON Tmp.[rootObject] = BizagiCatalog.[rootObject] AND Tmp.[guidObject] = BizagiCatalog.[guidObject]
				WHEN MATCHED THEN
					UPDATE SET	[guidObjectParent]   = Tmp.guidObjectParent,
								[objName]			 = Tmp.objName,               
								[objContent]         = Tmp.objContent,               								       
								[deployOnParent]     = Tmp.deployOnParent,               
								[modifiedDate]       = Tmp.modifiedDate,       
								[modifiedByUser]     = Tmp.modifiedByUser,               
								[mtdVersion]         = Tmp.mtdVersion,
								[changeSetId]        = Tmp.changeSetId, 
								[objContentResolved] = Tmp.objContentResolved, 
								[deleted]            = Tmp.deleted,
								[contentFormat]		 = Tmp.contentFormat          
				WHEN NOT MATCHED THEN
					INSERT ([guidObject],[guidObjectParent],[objName],[objContent],[objType], [objTypeName],[deployOnParent],[modifiedDate],
							[modifiedByUser],[mtdVersion],[rootObject],[changeSetId],[objContentResolved],[deleted], [contentFormat])
					VALUES
						   (Tmp.guidObject,Tmp.guidObjectParent,Tmp.objName,Tmp.objContent,Tmp.objType,Tmp.objTypeName,Tmp.deployOnParent,Tmp.modifiedDate,
							Tmp.modifiedByUser,Tmp.mtdVersion,Tmp.rootObject,Tmp.changeSetId,Tmp.objContentResolved,Tmp.deleted, Tmp.contentFormat)
				
				OPTION (LOOP JOIN);
		
				MERGE INTO BATAGVALUE A
				USING @ObjectCatalog Tmp ON Tmp.[rootObject] = A.rootObject AND Tmp.[guidObject] = A.taggedObject
				WHEN MATCHED THEN
					UPDATE SET deleted = @Deleted;
			
				INSERT INTO BATAGVALUE ([rootObject],[tagType],[tagName],[taggedObject],[value]) SELECT [rootObject],[tagType],[tagName],[taggedObject],[value] FROM  @ObjectTags;	
			
				MERGE INTO BACATALOGINDEXEDOBJECTS A
				USING @ObjectCatalog Tmp ON Tmp.[rootObject] = A.rootObject AND Tmp.[guidObject] = A.[targetGuid]
				WHEN MATCHED THEN
					UPDATE SET deleted = @Deleted;
		
				INSERT INTO BACATALOGINDEXEDOBJECTS ([rootObject], [name],[sourceGuid],[targetGuid]) SELECT [rootObject],[name],[sourceGuid],[targetGuid] FROM  @ObjectIndexes;
				
				--MERGE INTO BACATALOGREFERENCE A
				--USING @ObjectCatalog Tmp ON Tmp.[rootObject] = A.rootObject AND Tmp.[guidObject] = A.[guidObjectRef]
				--WHEN MATCHED THEN
				--	UPDATE SET deleted = @Delete
				
				IF @RootObject IS NOT NULL
				BEGIN
					UPDATE BABIZAGICATALOG SET changeSetId = @ChangeSetId WHERE rootObject = @RootObject AND guidObject = @RootObject;
				END

			COMMIT;
		')

	PRINT ('END: ALTER STORED PROCEDURE spBA_SQL_BizagiCatalogMerge')

	UPDATE BizAgiInfo 
	SET BAValue = @iBuild
	WHERE BAInfo = 'Build'

	PRINT('END: Build 5')
END
ELSE
BEGIN
	PRINT('Build 5 not applied on DB')
END

SET @iBuild	= 6
IF (@iCurBuild < @iBuild) 
BEGIN
	PRINT('BEGIN: Build 6')

	PRINT ('BEGIN: CREATE STORED PROCEDURE spBA_SQL_UpdateRefsAndContents_DB6')

	EXEC('CREATE PROCEDURE [dbo].[spBA_SQL_UpdateRefsAndContents_DB6]
		@RefsTable ReferencesTable READONLY,
		@ContentsTable NewContentsTable  READONLY
		AS
		BEGIN
			SET NOCOUNT ON;
		
			SET TRANSACTION ISOLATION LEVEL SNAPSHOT
			BEGIN TRANSACTION	 
		
			MERGE BABIZAGICATALOG BizagiCatalog
			USING @ContentsTable Tmp ON Tmp.rootObject = BizagiCatalog.rootObject AND Tmp.guidObject = BizagiCatalog.guidObject
			WHEN MATCHED THEN UPDATE SET objContent = Tmp.objContentExpanded;
			
			MERGE BACATALOGREFERENCE BizagiCatalogReference
			USING @RefsTable Tmp ON Tmp.rootObject = BizagiCatalogReference.rootObject AND Tmp.guidObjectRef = BizagiCatalogReference.guidObjectRef AND Tmp.guidObjectTarget = BizagiCatalogReference.guidObjectTarget
			WHEN MATCHED THEN UPDATE SET guidPointer = Tmp.guidPointer
			WHEN NOT MATCHED THEN
				INSERT (rootObject,guidPointer, guidObjectRef, guidObjectTarget) VALUES(
					Tmp.rootObject, Tmp.guidPointer, Tmp.guidObjectRef, Tmp.guidObjectTarget);
			
			IF NOT EXISTS(SELECT 1 FROM @ContentsTable WHERE guidObject IN( SELECT guidObjectRef from @RefsTable))
			BEGIN			
				UPDATE BACATALOGREFERENCE SET deleted = 1 WHERE guidObjectRef IN (SELECT guidObject FROM @ContentsTable WHERE guidObject NOT IN( SELECT guidObjectRef from @RefsTable));
			END
	
			COMMIT
						
		END
		')

	PRINT ('END: ALTER STORED PROCEDURE spBA_SQL_UpdateRefsAndContents')

	UPDATE BizAgiInfo 
	SET BAValue = @iBuild
	WHERE BAInfo = 'Build'

	PRINT('END: Build 6')
END
ELSE
BEGIN
	PRINT('Build 6 not applied on DB')
END

SET @iBuild	= 7
IF (@iCurBuild < @iBuild) 
BEGIN
	PRINT('BEGIN: Build 7')
	
	PRINT ('BEGIN: CREATE STORED PROCEDURE spBA_SQL_ImportPackage_DB7')
	EXEC('CREATE PROCEDURE [dbo].[spBA_SQL_ImportPackage_DB7]
            @IEObjectsTable IEObjectsTable READONLY ,
            @IEReferencesTable IEReferencesTable READONLY,
			@IEIndexesTable IEIndexesTable READONLY , 
            @IDTagsTable IETagsTable READONLY,
			@TransaccionRequired BIT
		AS
		BEGIN
		SET NOCOUNT ON;
		IF @TransaccionRequired = 1
		BEGIN
			SET TRANSACTION ISOLATION LEVEL SNAPSHOT
			BEGIN TRANSACTION
		END
	
			DELETE FROM BABIZAGICATALOG WHERE rootObject IN (SELECT DISTINCT(rootObject) FROM @IEObjectsTable);
		
			INSERT INTO BABIZAGICATALOG (guidObject,guidObjectParent,objName,objContent,objType,objTypeName,deployOnParent,modifiedDate,
					   modifiedByUser,mtdVersion,rootObject,changeSetId,objContentResolved,deleted,contentFormat)
			SELECT 	   guidObject,guidObjectParent,objName,objContent,objType,objTypeName,deployOnParent,modifiedDate,modifiedByUser,
					   mtdVersion,rootObject,changeSetId,objContentResolved,deleted,contentFormat
			FROM @IEObjectsTable;

			DELETE FROM BACATALOGREFERENCE WHERE rootObject IN (SELECT DISTINCT(rootObject) FROM @IEObjectsTable);
			
			INSERT INTO BACATALOGREFERENCE(rootObject, guidPointer,guidObjectRef,guidObjectTarget,deleted)
			SELECT rootObject, guidPointer, guidObjectRef ,guidObjectTarget ,deleted FROM @IEReferencesTable;
			
			DELETE FROM BACATALOGINDEXEDOBJECTS WHERE rootObject IN (SELECT DISTINCT(rootObject) FROM @IEObjectsTable);
			
			INSERT INTO BACATALOGINDEXEDOBJECTS (rootObject, name,sourceGuid,targetGuid,deleted)
			SELECT rootObject,name,sourceGuid,targetGuid,deleted FROM @IEIndexesTable;
			
			DELETE FROM BATAGVALUE WHERE rootObject IN (SELECT DISTINCT(rootObject) FROM @IEObjectsTable);
			
			INSERT INTO BATAGVALUE (rootObject, tagType, tagName ,taggedObject ,value ,deleted)
			SELECT rootObject, tagType, tagName ,taggedObject ,value ,deleted FROM @IDTagsTable;
		IF @TransaccionRequired = 1
			COMMIT;					
	END')
	PRINT ('END: UPDATE STORED PROCEDURE spBA_SQL_ImportPackage')

	UPDATE BizAgiInfo 
	SET BAValue = @iBuild
	WHERE BAInfo = 'Build'

	PRINT('END: Build 7')
END
ELSE
BEGIN
	PRINT('Build 7 not applied on DB')
END


SET @iBuild	= 8
IF (@iCurBuild < @iBuild) 
BEGIN
	PRINT('BEGIN: Build 8')
	
	PRINT ('BEGIN: CREATE TYPE GuidList')

	EXEC('CREATE TYPE [dbo].[GuidList] AS TABLE(
	[guidObject] [uniqueidentifier] NOT NULL,
	PRIMARY KEY CLUSTERED 
		(
			[guidObject] ASC
		)WITH (IGNORE_DUP_KEY = OFF)
	)')

	PRINT ('END: CREATE TYPE GuidList')
	
	PRINT ('BEGIN: UPDATE STORED PROCEDURE spBA_SQL_CleanCatalog')

	EXEC('CREATE PROCEDURE [dbo].[spBA_SQL_CleanCatalog_DB8]
		AS
		BEGIN
		SET NOCOUNT ON;		
		SET TRANSACTION ISOLATION LEVEL SNAPSHOT
		DECLARE @Result AS BIT = 0
		DECLARE @yesterday AS DATE = CONVERT(DATE, DATEADD(dd, -1, getdate()))
		BEGIN TRANSACTION
		
			CREATE TABLE #CatalogObjects
				(
					guidObject uniqueidentifier
				)
				
				INSERT INTO #CatalogObjects
				SELECT guidObject from babizagicatalog
				WHERE deleted = 1 and CONVERT(DATE,modifieddate) = @yesterday
				
				DELETE FROM batagvalue
				WHERE taggedObject IN(SELECT guidObject FROM #CatalogObjects)
				
				DELETE FROM bacatalogindexedobjects
				WHERE targetGuid IN(SELECT guidObject FROM #CatalogObjects) or sourceGuid IN(SELECT guidObject FROM #CatalogObjects)
				
				DELETE FROM bacatalogreference
				WHERE guidObjectRef IN(SELECT guidObject FROM #CatalogObjects) 
				

				-------

				DELETE TOP(10000) FROM batagvalue
				WHERE deleted = 1
			
				DELETE TOP(10000) FROM bacatalogindexedobjects
				WHERE deleted = 1
			
				DELETE TOP(10000) FROM bacatalogreference
				WHERE deleted = 1
			
				DROP TABLE #CatalogObjects

				IF EXISTS (SELECT TOP (1) taggedObject from batagvalue where deleted = 1) SET @Result = 1
				IF EXISTS (SELECT TOP (1) targetGuid from bacatalogindexedobjects where deleted = 1) SET @Result = 1
				IF EXISTS (SELECT TOP (1) guidObjectRef from bacatalogreference where deleted = 1) SET @Result = 1

				SELECT @Result
			
		COMMIT;					
	END')

	PRINT ('END: UPDATE STORED PROCEDURE spBA_SQL_CleanCatalog')

	PRINT ('BEGIN: CREATE STORED PROCEDURE spBA_SQL_GetDependencyTree')

	EXEC('CREATE PROCEDURE [dbo].[spBA_SQL_GetDependencyTree]
			@GuidObjects GuidList READONLY		
			AS
			WITH DependenciesChildren(guidObject,guidObjectParent,deployOnParent)
            AS
            (
            	SELECT guidObject,guidObjectParent,deployOnParent
            		FROM vwBA_Catalog_BABIZAGICATALOG
            		WHERE convert(varchar(100),guidObject) IN (SELECT guidObject from @GuidObjects) 
            	UNION ALL
            		SELECT depSource.guidObject,depSource.guidObjectParent,depSource.deployOnParent
            		FROM vwBA_Catalog_BABIZAGICATALOG depSource
            		INNER JOIN DependenciesChildren depTarget
            		ON depSource.guidObjectParent = depTarget.guidObject
            )
            select guidObject from DependenciesChildren option(maxrecursion 10000)')

	PRINT ('END: CREATE STORED PROCEDURE spBA_SQL_GetDependencyTree')

	PRINT ('BEGIN: CREATE STORED PROCEDURE spBA_SQL_GetReferences')

	EXEC('CREATE PROCEDURE [dbo].[spBA_SQL_GetReferences]
		@GuidObjects GuidList READONLY
		AS
		SELECT guidPointer FROM vwBA_Catalog_BAREFERENCE WHERE guidObjectTarget IN (SELECT guidObject FROM @GuidObjects) AND guidObjectRef NOT IN (SELECT guidObject FROM @GuidObjects) 
	')

	PRINT ('END: CREATE STORED PROCEDURE spBA_SQL_GetDependencyTree')

	UPDATE BizAgiInfo 
	SET BAValue = @iBuild
	WHERE BAInfo = 'Build'

	PRINT('END: Build 8')
END
SET @iBuild	= 9
IF (@iCurBuild < @iBuild) 
BEGIN
	PRINT ('BEGIN: ALTER TABLE BATAGVALUE')

	ALTER TABLE BATAGVALUE ALTER COLUMN value NVARCHAR(4000)

	PRINT ('END: ALTER TABLE BATAGVALUE')

	IF EXISTS (SELECT * FROM sys.types st JOIN sys.schemas ss ON st.schema_id = ss.schema_id WHERE st.name = N'TagValueType' AND ss.name = N'dbo')
	BEGIN
		PRINT ('BEGIN: ALTER TABLE BATAGVALUE')

		ALTER TABLE BATAGVALUE ALTER COLUMN value NVARCHAR(4000)

		PRINT ('END: ALTER TABLE BATAGVALUE')

		IF EXISTS (SELECT * FROM sys.types st JOIN sys.schemas ss ON st.schema_id = ss.schema_id WHERE st.name = N'TagValueType' AND ss.name = N'dbo')
		BEGIN
			PRINT ('BEGIN: DROP STORED PROCEDURE spBA_SQL_BizagiCatalogMerge')

			IF EXISTS (SELECT 1 FROM dbo.sysobjects WHERE id = OBJECT_ID(N'spBA_SQL_BizagiCatalogMerge'))
			BEGIN
				DROP PROC [dbo].[spBA_SQL_BizagiCatalogMerge];
			END

			IF EXISTS (SELECT 1 FROM dbo.sysobjects WHERE id = OBJECT_ID(N'spBA_SQL_BizagiCatalogMerge_DB5'))
			BEGIN
				DROP PROC [dbo].[spBA_SQL_BizagiCatalogMerge_DB5];
			END

			PRINT ('END: DROP STORED PROCEDURE spBA_SQL_BizagiCatalogMerge')

			PRINT ('BEGIN: DROP TYPE TagValueType')

			DROP TYPE [dbo].[TagValueType];

			PRINT ('END: DROP TYPE TagValueType')

			PRINT ('BEGIN: CREATE TYPE TagValueType')

			CREATE TYPE [dbo].[TagValueType] AS TABLE(
			[rootObject] [uniqueidentifier] NULL,
			[tagType] [uniqueidentifier] NOT NULL,
			[tagName] [varchar](50) NOT NULL,
			[taggedObject] [uniqueidentifier] NOT NULL,
			[value] [nvarchar](4000) NOT NULL,
			[deleted] [bit] NULL);

			PRINT ('END: CREATE TYPE TagValueType')

			PRINT ('BEGIN: RE-CREATE STORED PROCEDURE spBA_SQL_BizagiCatalogMerge')

			IF NOT EXISTS (SELECT 1 FROM dbo.sysobjects WHERE id = OBJECT_ID(N'spBA_SQL_BizagiCatalogMerge'))
			BEGIN
				EXEC('CREATE PROCEDURE [dbo].[spBA_SQL_BizagiCatalogMerge]
						@ObjectCatalog BizagiCatalogType READONLY,
						@ObjectTags TagValueType READONLY,
						@ObjectIndexes CatalogIndexedObjectsType READONLY,
						@RootObject uniqueidentifier = NULL,
						@ChangeSetId INT = 0			
						AS
						DECLARE @Deleted int		
						SET @Deleted = 1;
						SET NOCOUNT ON;
						SET TRANSACTION ISOLATION LEVEL SNAPSHOT
						BEGIN TRANSACTION
							MERGE BABIZAGICATALOG AS BizagiCatalog
							USING @ObjectCatalog Tmp ON Tmp.[rootObject] = BizagiCatalog.[rootObject] AND Tmp.[guidObject] = BizagiCatalog.[guidObject]
							WHEN MATCHED THEN
								UPDATE SET	[guidObjectParent]   = Tmp.guidObjectParent,
											[objName]			 = Tmp.objName,               
											[objContent]         = Tmp.objContent,               								       
											[deployOnParent]     = Tmp.deployOnParent,               
											[modifiedDate]       = Tmp.modifiedDate,       
											[modifiedByUser]     = Tmp.modifiedByUser,               
											[mtdVersion]         = Tmp.mtdVersion,
											[changeSetId]        = Tmp.changeSetId, 
											[objContentResolved] = Tmp.objContentResolved, 
											[deleted]            = Tmp.deleted,
											[contentFormat]		 = Tmp.contentFormat          
							WHEN NOT MATCHED THEN
								INSERT ([guidObject],[guidObjectParent],[objName],[objContent],[objType], [objTypeName],[deployOnParent],[modifiedDate],
										[modifiedByUser],[mtdVersion],[rootObject],[changeSetId],[objContentResolved],[deleted], [contentFormat])
								VALUES
									   (Tmp.guidObject,Tmp.guidObjectParent,Tmp.objName,Tmp.objContent,Tmp.objType,Tmp.objTypeName,Tmp.deployOnParent,Tmp.modifiedDate,
										Tmp.modifiedByUser,Tmp.mtdVersion,Tmp.rootObject,Tmp.changeSetId,Tmp.objContentResolved,Tmp.deleted, Tmp.contentFormat)
				
							OPTION (LOOP JOIN);
		
							MERGE INTO BATAGVALUE A
							USING @ObjectCatalog Tmp ON Tmp.[rootObject] = A.rootObject AND Tmp.[guidObject] = A.taggedObject
							WHEN MATCHED THEN
								UPDATE SET deleted = @Deleted;
			
							INSERT INTO BATAGVALUE ([rootObject],[tagType],[tagName],[taggedObject],[value]) SELECT [rootObject],[tagType],[tagName],[taggedObject],[value] FROM  @ObjectTags;	
			
							MERGE INTO BACATALOGINDEXEDOBJECTS A
							USING @ObjectCatalog Tmp ON Tmp.[rootObject] = A.rootObject AND Tmp.[guidObject] = A.[targetGuid]
							WHEN MATCHED THEN
								UPDATE SET deleted = @Deleted;
		
							INSERT INTO BACATALOGINDEXEDOBJECTS ([rootObject], [name],[sourceGuid],[targetGuid]) SELECT [rootObject],[name],[sourceGuid],[targetGuid] FROM  @ObjectIndexes;
				
							--MERGE INTO BACATALOGREFERENCE A
							--USING @ObjectCatalog Tmp ON Tmp.[rootObject] = A.rootObject AND Tmp.[guidObject] = A.[guidObjectRef]
							--WHEN MATCHED THEN
							--	UPDATE SET deleted = @Delete
				
							IF @RootObject IS NOT NULL
							BEGIN
								UPDATE BABIZAGICATALOG SET changeSetId = @ChangeSetId WHERE rootObject = @RootObject AND guidObject = @RootObject;
							END

						COMMIT;
					');
					END

			IF NOT EXISTS (SELECT 1 FROM dbo.sysobjects WHERE id = OBJECT_ID(N'spBA_SQL_BizagiCatalogMerge_DB9'))
			BEGIN
				EXEC('CREATE PROCEDURE [dbo].[spBA_SQL_BizagiCatalogMerge_DB9]
						@ObjectCatalog BizagiCatalogType READONLY,
						@ObjectTags TagValueType READONLY,
						@ObjectIndexes CatalogIndexedObjectsType READONLY,
						@RootObject uniqueidentifier = NULL,
						@ChangeSetId INT = 0			
						AS
						DECLARE @Deleted int		
						SET @Deleted = 1;
						SET NOCOUNT ON;
						SET TRANSACTION ISOLATION LEVEL SNAPSHOT
						BEGIN TRANSACTION
							MERGE BABIZAGICATALOG AS BizagiCatalog
							USING @ObjectCatalog Tmp ON Tmp.[rootObject] = BizagiCatalog.[rootObject] AND Tmp.[guidObject] = BizagiCatalog.[guidObject]
							WHEN MATCHED THEN
								UPDATE SET	[guidObjectParent]   = Tmp.guidObjectParent,
											[objName]			 = Tmp.objName,               
											[objContent]         = Tmp.objContent,               								       
											[deployOnParent]     = Tmp.deployOnParent,               
											[modifiedDate]       = Tmp.modifiedDate,       
											[modifiedByUser]     = Tmp.modifiedByUser,               
											[mtdVersion]         = Tmp.mtdVersion,
											[changeSetId]        = Tmp.changeSetId, 
											[objContentResolved] = Tmp.objContentResolved, 
											[deleted]            = Tmp.deleted,
											[contentFormat]		 = Tmp.contentFormat          
							WHEN NOT MATCHED THEN
								INSERT ([guidObject],[guidObjectParent],[objName],[objContent],[objType], [objTypeName],[deployOnParent],[modifiedDate],
										[modifiedByUser],[mtdVersion],[rootObject],[changeSetId],[objContentResolved],[deleted], [contentFormat])
								VALUES
									   (Tmp.guidObject,Tmp.guidObjectParent,Tmp.objName,Tmp.objContent,Tmp.objType,Tmp.objTypeName,Tmp.deployOnParent,Tmp.modifiedDate,
										Tmp.modifiedByUser,Tmp.mtdVersion,Tmp.rootObject,Tmp.changeSetId,Tmp.objContentResolved,Tmp.deleted, Tmp.contentFormat)
				
							OPTION (LOOP JOIN);
		
							MERGE INTO BATAGVALUE A
							USING @ObjectCatalog Tmp ON Tmp.[rootObject] = A.rootObject AND Tmp.[guidObject] = A.taggedObject
							WHEN MATCHED THEN
								UPDATE SET deleted = @Deleted;
			
							INSERT INTO BATAGVALUE ([rootObject],[tagType],[tagName],[taggedObject],[value]) SELECT [rootObject],[tagType],[tagName],[taggedObject],[value] FROM  @ObjectTags;	
			
							MERGE INTO BACATALOGINDEXEDOBJECTS A
							USING @ObjectCatalog Tmp ON Tmp.[rootObject] = A.rootObject AND Tmp.[guidObject] = A.[targetGuid]
							WHEN MATCHED THEN
								UPDATE SET deleted = @Deleted;
		
							INSERT INTO BACATALOGINDEXEDOBJECTS ([rootObject], [name],[sourceGuid],[targetGuid]) SELECT [rootObject],[name],[sourceGuid],[targetGuid] FROM  @ObjectIndexes;
				
							--MERGE INTO BACATALOGREFERENCE A
							--USING @ObjectCatalog Tmp ON Tmp.[rootObject] = A.rootObject AND Tmp.[guidObject] = A.[guidObjectRef]
							--WHEN MATCHED THEN
							--	UPDATE SET deleted = @Delete
				
							IF @RootObject IS NOT NULL
							BEGIN
								UPDATE BABIZAGICATALOG SET changeSetId = @ChangeSetId WHERE rootObject = @RootObject AND guidObject = @RootObject;
							END

						COMMIT;
					');
					END

				PRINT ('END: RE-CREATE STORED PROCEDURE spBA_SQL_BizagiCatalogMerge')
			END
	END
	UPDATE BizAgiInfo 
	SET BAValue = @iBuild
	WHERE BAInfo = 'Build'

	PRINT('END: Build 9')
	END
	ELSE
	BEGIN
		PRINT('Build 9 not applied on DB')
	END
SET @iBuild	= 10
IF (@iCurBuild < @iBuild) 
BEGIN
	IF EXISTS (SELECT * FROM sys.types st JOIN sys.schemas ss ON st.schema_id = ss.schema_id WHERE st.name = N'BizagiCatalogType' AND ss.name = N'dbo')
		BEGIN
			PRINT ('BEGIN: CREATE TYPE BizagiCatalogType')

			CREATE TYPE [dbo].[BizagiCatalogType_1] AS TABLE(
			[guidObject] [uniqueidentifier] NOT NULL,
			[guidObjectParent] [uniqueidentifier] NULL,
			[objName] [varchar](256) NOT NULL,
			[objContent] [varbinary](max) NULL,
			[objType] [int] NOT NULL,
			[objTypeName] [varchar](50) NULL,
			[deployOnParent] [bit] NOT NULL,
			[modifiedDate] [datetime] NULL,
			[modifiedByUser] [varchar](100) NULL,
			[mtdVersion] [int] NULL,
			[rootObject] [uniqueidentifier] NOT NULL,
			[changeSetId] [int] NULL,
			[objContentResolved] [varbinary](max) NULL,
			[deleted] [bit] NULL,
			[contentFormat] [tinyint] NULL,
			[updateContent] [bit] NULL,
			PRIMARY KEY CLUSTERED 
			(
				[rootObject] ASC,
				[guidObject] ASC
			)WITH (IGNORE_DUP_KEY = OFF)
			)

			PRINT ('END: CREATE TYPE BizagiCatalogType')			

			IF NOT EXISTS (SELECT 1 FROM dbo.sysobjects WHERE id = OBJECT_ID(N'spBA_SQL_BizagiCatalogMerge_DB10'))
				BEGIN
					EXEC('CREATE PROCEDURE [dbo].[spBA_SQL_BizagiCatalogMerge_DB10]
							@ObjectCatalog BizagiCatalogType_1 READONLY,
							@ObjectTags TagValueType READONLY,
							@ObjectIndexes CatalogIndexedObjectsType READONLY,
							@RootObject uniqueidentifier = NULL,
							@ChangeSetId INT = 0			
							AS
							DECLARE @Deleted int		
							SET @Deleted = 1;
							SET NOCOUNT ON;
							SET TRANSACTION ISOLATION LEVEL SNAPSHOT
							BEGIN TRANSACTION
								MERGE BABIZAGICATALOG AS BizagiCatalog
								USING @ObjectCatalog Tmp ON Tmp.[rootObject] = BizagiCatalog.[rootObject] AND Tmp.[guidObject] = BizagiCatalog.[guidObject]
								WHEN MATCHED THEN
									UPDATE SET	[guidObjectParent]   = Case Tmp.updateContent when 0 then Tmp.guidObjectParent else BizagiCatalog.[guidObjectParent] end,
												[objName]			 = Case Tmp.updateContent when 0 then Tmp.objName else BizagiCatalog.[objName] end,               
												[objContent]         = Tmp.objContent,               								       
												[deployOnParent]     = Case Tmp.updateContent when 0 then Tmp.deployOnParent else BizagiCatalog.[deployOnParent] end,               
												[modifiedDate]       = Tmp.modifiedDate,       
												[modifiedByUser]     = Tmp.modifiedByUser,               
												[mtdVersion]         = Case Tmp.updateContent when 0 then Tmp.mtdVersion else BizagiCatalog.[mtdVersion] end,
												[changeSetId]        = Tmp.changeSetId, 
												[objContentResolved] = Tmp.objContentResolved, 
												[deleted]            = Case Tmp.updateContent when 0 then Tmp.deleted else BizagiCatalog.[deleted] end,
												[contentFormat]		 = Tmp.contentFormat      
								WHEN NOT MATCHED THEN
									INSERT ([guidObject],[guidObjectParent],[objName],[objContent],[objType], [objTypeName],[deployOnParent],[modifiedDate],
											[modifiedByUser],[mtdVersion],[rootObject],[changeSetId],[objContentResolved],[deleted], [contentFormat])
									VALUES
											(Tmp.guidObject,Tmp.guidObjectParent,Tmp.objName,Tmp.objContent,Tmp.objType,Tmp.objTypeName,Tmp.deployOnParent,Tmp.modifiedDate,
											Tmp.modifiedByUser,Tmp.mtdVersion,Tmp.rootObject,Tmp.changeSetId,Tmp.objContentResolved,Tmp.deleted, Tmp.contentFormat)
				
								OPTION (LOOP JOIN);
		
								MERGE INTO BATAGVALUE A
								USING @ObjectCatalog Tmp ON Tmp.[rootObject] = A.rootObject AND Tmp.[guidObject] = A.taggedObject
								WHEN MATCHED THEN
									UPDATE SET deleted = @Deleted;
			
								INSERT INTO BATAGVALUE ([rootObject],[tagType],[tagName],[taggedObject],[value]) SELECT [rootObject],[tagType],[tagName],[taggedObject],[value] FROM  @ObjectTags;	
			
								MERGE INTO BACATALOGINDEXEDOBJECTS A
								USING @ObjectCatalog Tmp ON Tmp.[rootObject] = A.rootObject AND Tmp.[guidObject] = A.[targetGuid]
								WHEN MATCHED THEN
									UPDATE SET deleted = @Deleted;
		
								INSERT INTO BACATALOGINDEXEDOBJECTS ([rootObject], [name],[sourceGuid],[targetGuid]) SELECT [rootObject],[name],[sourceGuid],[targetGuid] FROM  @ObjectIndexes;
				
								--MERGE INTO BACATALOGREFERENCE A
								--USING @ObjectCatalog Tmp ON Tmp.[rootObject] = A.rootObject AND Tmp.[guidObject] = A.[guidObjectRef]
								--WHEN MATCHED THEN
								--	UPDATE SET deleted = @Delete
				
								IF @RootObject IS NOT NULL
								BEGIN
									UPDATE BABIZAGICATALOG SET changeSetId = @ChangeSetId WHERE rootObject = @RootObject AND guidObject = @RootObject;
								END

							COMMIT;
						');
						END

				PRINT ('END: RE-CREATE STORED PROCEDURE spBA_SQL_BizagiCatalogMerge')
		END
	UPDATE BizAgiInfo 
	SET BAValue = @iBuild
	WHERE BAInfo = 'Build'

	PRINT('END: Build 10')
END
ELSE
BEGIN
	PRINT('Build 10 not applied on DB')
END

SET @iBuild	= 11
IF (@iCurBuild < @iBuild) 
BEGIN
	
	IF EXISTS (select * from dbo.sysobjects where id = object_id('vwBA_Catalog_BABIZAGICATALOG') and OBJECTPROPERTY(id, 'IsView') = 1)
		EXEC(' drop view vwBA_Catalog_BABIZAGICATALOG ');

		EXEC('
			CREATE VIEW vwBA_Catalog_BABIZAGICATALOG AS    
			SELECT guidObject, guidObjectParent, objName, objContent, objType, 
			objTypeName, deployOnParent, modifiedDate, modifiedByUser, mtdVersion, rootObject, changeSetId, objContentResolved, deleted, ''0'' as ''IsOverride'', ''0'' as ''IsSystem'', contentFormat
			FROM BABIZAGICATALOG
		');

		PRINT('END: Create vwBA_Catalog_BABIZAGICATALOG view');

		PRINT('BEGIN: Create vwBA_Catalog_BAREFERENCE view');

	IF EXISTS (select * from dbo.sysobjects where id = object_id('vwBA_Catalog_BAREFERENCE') and OBJECTPROPERTY(id, 'IsView') = 1)
		EXEC (' DROP view vwBA_Catalog_BAREFERENCE ');

		EXEC('
			CREATE VIEW vwBA_Catalog_BAREFERENCE AS
			SELECT guidPointer, guidObjectRef, guidObjectTarget, ''0'' as ''IsOverride'', deleted, rootObject
			FROM BACATALOGREFERENCE
		');

	PRINT('END: Create vwBA_Catalog_BAREFERENCE view');

	PRINT('BEGIN: Create vwBA_Catalog_BATAGVALUE view');

	IF EXISTS (select * from dbo.sysobjects where id = object_id('vwBA_Catalog_BATAGVALUE') and OBJECTPROPERTY(id, 'IsView') = 1)
		EXEC(' drop view vwBA_Catalog_BATAGVALUE ');

		EXEC('
			CREATE VIEW vwBA_Catalog_BATAGVALUE AS
			SELECT tagType, taggedObject, tagName, value, deleted, ''0'' as ''IsOverride'', ''0'' as ''IsSystem'', rootObject
			FROM BATAGVALUE
		');
	UPDATE BizAgiInfo 
	SET BAValue = @iBuild
	WHERE BAInfo = 'Build'

	PRINT('END: Build 11')
END
ELSE
BEGIN
	PRINT('Build 11 not applied on DB')
END

SET @iBuild	= 12
IF (@iCurBuild < @iBuild) 
BEGIN
	
	PRINT ('BEGIN: ALTER STORED PROCEDURE spBA_SQL_GetDependencyTree')

	EXEC('ALTER PROCEDURE [dbo].[spBA_SQL_GetDependencyTree]
			@GuidObjects GuidList READONLY		
			AS
			WITH DependenciesChildren(guidObject, guidObjectParent, objType, objTypeName, objName, deployOnParent, rootObject, changeSetId, deleted )
            AS
            (
            	SELECT guidObject, guidObjectParent, objType, objTypeName, objName, deployOnParent, rootObject, changeSetId, deleted
            		FROM vwBA_Catalog_BABIZAGICATALOG
            		WHERE convert(varchar(100),guidObject) IN (SELECT guidObject from @GuidObjects) AND (deleted IS NULL OR deleted = 0)
            	UNION ALL
            		SELECT depSource.guidObject, depSource.guidObjectParent, depSource.objType, depSource.objTypeName, depSource.objName, depSource.deployOnParent, depSource.rootObject, depSource.changeSetId, depSource.deleted
            		FROM vwBA_Catalog_BABIZAGICATALOG depSource
            		INNER JOIN DependenciesChildren depTarget
            		ON depSource.guidObjectParent = depTarget.guidObject
            )
            select guidObject, guidObjectParent, objType, objTypeName, objName, deployOnParent, rootObject, changeSetId, deleted from DependenciesChildren option(maxrecursion 10000)')

	PRINT ('END: ALTER STORED PROCEDURE spBA_SQL_GetDependencyTree')
	UPDATE BizAgiInfo 
	SET BAValue = @iBuild
	WHERE BAInfo = 'Build'

	PRINT('END: Build 12')
END
ELSE
BEGIN
	PRINT('Build 12 not applied on DB')
END


SET @iBuild	= 13
IF (@iCurBuild < @iBuild) 
BEGIN
	
	PRINT ('BEGIN Build 13')

	PRINT ('BEGIN: CREATE TYPE TypeList')

	EXEC('CREATE TYPE [dbo].[TypeList] AS TABLE(
	[typeName] varchar(100) NOT NULL,
	PRIMARY KEY CLUSTERED 
		(
			[typeName] ASC
		)WITH (IGNORE_DUP_KEY = OFF)
	)')

	PRINT ('END: CREATE TYPE TypeList')

	UPDATE BizAgiInfo 
	SET BAValue = @iBuild
	WHERE BAInfo = 'Build'

	PRINT('END: Build 13')
END
ELSE
BEGIN
	PRINT('Build 13 not applied on DB')
END


SET @iBuild	= 14
IF (@iCurBuild < @iBuild) 
BEGIN
IF NOT EXISTS (SELECT 1 FROM dbo.sysobjects WHERE id = OBJECT_ID(N'spBA_SQL_BizagiCatalogMerge_DB14'))
	BEGIN
		EXEC('CREATE PROCEDURE [dbo].[spBA_SQL_BizagiCatalogMerge_DB14]
				@ObjectCatalog BizagiCatalogType_1 READONLY,
				@ObjectTags TagValueType READONLY,
				@ObjectIndexes CatalogIndexedObjectsType READONLY,
				@RootObject uniqueidentifier = NULL,
				@ChangeSetId INT = 0			
				AS
				DECLARE @Deleted int		
				SET @Deleted = 1;
				SET NOCOUNT ON;
				SET TRANSACTION ISOLATION LEVEL SNAPSHOT
				BEGIN TRANSACTION
					MERGE BABIZAGICATALOG AS BizagiCatalog
					USING @ObjectCatalog Tmp ON Tmp.[rootObject] = BizagiCatalog.[rootObject] AND Tmp.[guidObject] = BizagiCatalog.[guidObject]
					WHEN MATCHED THEN
						UPDATE SET	[guidObjectParent]   = Case Tmp.updateContent when 0 then Tmp.guidObjectParent else BizagiCatalog.[guidObjectParent] end,
									[objName]			 = Case Tmp.updateContent when 0 then Tmp.objName else BizagiCatalog.[objName] end,               
									[objContent]         = Tmp.objContent,               								       
									[deployOnParent]     = Case Tmp.updateContent when 0 then Tmp.deployOnParent else BizagiCatalog.[deployOnParent] end,               
									[modifiedDate]       = Tmp.modifiedDate,       
									[modifiedByUser]     = Tmp.modifiedByUser,               
									[mtdVersion]         = Case Tmp.updateContent when 0 then Tmp.mtdVersion else BizagiCatalog.[mtdVersion] end,
									[changeSetId]        = Tmp.changeSetId, 
									[objContentResolved] = Tmp.objContentResolved, 
									[deleted]            = Case Tmp.updateContent when 0 then Tmp.deleted else BizagiCatalog.[deleted] end,
									[contentFormat]		 = Tmp.contentFormat      
					WHEN NOT MATCHED THEN
						INSERT ([guidObject],[guidObjectParent],[objName],[objContent],[objType], [objTypeName],[deployOnParent],[modifiedDate],
								[modifiedByUser],[mtdVersion],[rootObject],[changeSetId],[objContentResolved],[deleted], [contentFormat])
						VALUES
								(Tmp.guidObject,Tmp.guidObjectParent,Tmp.objName,Tmp.objContent,Tmp.objType,Tmp.objTypeName,Tmp.deployOnParent,Tmp.modifiedDate,
								Tmp.modifiedByUser,Tmp.mtdVersion,Tmp.rootObject,Tmp.changeSetId,Tmp.objContentResolved,Tmp.deleted, Tmp.contentFormat)
				
					OPTION (LOOP JOIN);
		
					MERGE INTO BATAGVALUE A
					USING @ObjectCatalog Tmp ON Tmp.[rootObject] = A.rootObject AND Tmp.[guidObject] = A.taggedObject
					WHEN MATCHED THEN
						UPDATE SET deleted = @Deleted;
			
					INSERT INTO BATAGVALUE ([rootObject],[tagType],[tagName],[taggedObject],[value]) SELECT [rootObject],[tagType],[tagName],[taggedObject],[value] FROM  @ObjectTags;	
			
					MERGE INTO BACATALOGINDEXEDOBJECTS A
					USING @ObjectCatalog Tmp ON Tmp.[rootObject] = A.rootObject AND Tmp.[guidObject] = A.[targetGuid]
					WHEN MATCHED THEN
						UPDATE SET deleted = @Deleted;
		
					INSERT INTO BACATALOGINDEXEDOBJECTS ([rootObject], [name],[sourceGuid],[targetGuid]) SELECT [rootObject],[name],[sourceGuid],[targetGuid] FROM  @ObjectIndexes;
				
					MERGE INTO BACATALOGREFERENCE A
					USING @ObjectCatalog Tmp ON Tmp.[rootObject] = A.rootObject AND Tmp.[guidObject] = A.[guidObjectRef]
					WHEN MATCHED THEN
					UPDATE SET deleted = @Deleted;
				
					IF @RootObject IS NOT NULL
					BEGIN
						UPDATE BABIZAGICATALOG SET changeSetId = @ChangeSetId WHERE rootObject = @RootObject AND guidObject = @RootObject;
					END

				COMMIT;
			');

			PRINT ('END: RE-CREATE STORED PROCEDURE spBA_SQL_BizagiCatalogMerge')	
			UPDATE BizAgiInfo 
			SET BAValue = @iBuild
			WHERE BAInfo = 'Build'

			PRINT('END: Build 14')
	END
END
ELSE
BEGIN
	PRINT('Build 14 not applied on DB')
END

SET @iBuild	= 15
IF (@iCurBuild < @iBuild) 
BEGIN
	PRINT('BEGIN: Build 15')

	PRINT ('BEGIN: CREATE STORED PROCEDURE spBA_SQL_UpdateRefsAndContents_DB15')

	EXEC('CREATE PROCEDURE [dbo].[spBA_SQL_UpdateRefsAndContents_DB15]
		@RefsTable ReferencesTable READONLY,
		@ContentsTable NewContentsTable  READONLY
		AS
		BEGIN
			SET NOCOUNT ON;
		
			SET TRANSACTION ISOLATION LEVEL SNAPSHOT
			BEGIN TRANSACTION	 
		
			MERGE BABIZAGICATALOG BizagiCatalog
			USING @ContentsTable Tmp ON Tmp.rootObject = BizagiCatalog.rootObject AND Tmp.guidObject = BizagiCatalog.guidObject
			WHEN MATCHED THEN UPDATE SET objContent = Tmp.objContentExpanded;
			
			MERGE BACATALOGREFERENCE BizagiCatalogReference
			USING @RefsTable Tmp ON Tmp.rootObject = BizagiCatalogReference.rootObject AND Tmp.guidObjectRef = BizagiCatalogReference.guidObjectRef AND Tmp.guidObjectTarget = BizagiCatalogReference.guidObjectTarget
			WHEN MATCHED THEN UPDATE SET guidPointer = Tmp.guidPointer, deleted = 0
			WHEN NOT MATCHED THEN
				INSERT (rootObject,guidPointer, guidObjectRef, guidObjectTarget) VALUES(
					Tmp.rootObject, Tmp.guidPointer, Tmp.guidObjectRef, Tmp.guidObjectTarget);
			
			IF NOT EXISTS(SELECT 1 FROM @ContentsTable WHERE guidObject IN( SELECT guidObjectRef from @RefsTable))
			BEGIN			
				UPDATE BACATALOGREFERENCE SET deleted = 1 WHERE guidObjectRef IN (SELECT guidObject FROM @ContentsTable WHERE guidObject NOT IN( SELECT guidObjectRef from @RefsTable));
			END
	
			COMMIT
						
		END
		')

	PRINT ('END: ALTER STORED PROCEDURE spBA_SQL_UpdateRefsAndContents')

	UPDATE BizAgiInfo 
	SET BAValue = @iBuild
	WHERE BAInfo = 'Build'

	PRINT('END: Build 15')
END
ELSE
BEGIN
	PRINT('Build 15 not applied on DB')
END

SET @iBuild	= 16
IF (@iCurBuild < @iBuild) 
BEGIN
	PRINT('BEGIN: Build 16')

	PRINT ('BEGIN: CREATE TYPE ComposedGuidList')
	IF NOT EXISTS (SELECT 1  FROM dbo.systypes where usertype = TYPE_ID(N'ComposedGuidList'))
	BEGIN
		EXEC('CREATE TYPE [dbo].[ComposedGuidList] AS TABLE(
				[guidParent] [uniqueidentifier] NOT NULL,
				[guidChild] [uniqueidentifier] NOT NULL)')

		PRINT ('END: CREATE TYPE ComposedGuidList')

		UPDATE BizAgiInfo 
		SET BAValue = @iBuild
		WHERE BAInfo = 'Build'

		PRINT('END: Build 16')
	END
END
ELSE
BEGIN
	PRINT('Build 16 not applied on DB')
END

