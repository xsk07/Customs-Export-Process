ALTER DATABASE {0} SET ALLOW_SNAPSHOT_ISOLATION ON

/****************************CATALOG TABLES******************************/
IF not exists (select 1 from dbo.sysobjects where id = object_id(N'BIZAGIINFO') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
	PRINT ('BEGIN: CREATE TABLE BIZAGIINFO')
	CREATE TABLE BIZAGIINFO(
		BAInfo VARCHAR(20) NOT NULL,
		BAValue VARCHAR(40) NULL
	);
	CREATE CLUSTERED INDEX BIZAGIINFO_IDX ON BIZAGIINFO (BAInfo);
	PRINT ('END: CREATE TABLE BIZAGIINFO')

	PRINT ('BIZAGIINFO: SET DEFAULT ENVIRONMENT')
	INSERT INTO BIZAGIINFO (BAInfo, BAValue) VALUES ('Environment', 'Development')
END
GO

IF not exists (select 1 from dbo.sysobjects where id = object_id(N'BABIZAGICATALOG') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN	
	PRINT ('BEGIN: CREATE TABLE BABIZAGICATALOG')
	CREATE TABLE BABIZAGICATALOG (
		guidObject uniqueidentifier,
		guidObjectParent uniqueidentifier NULL,
		objName VARCHAR(256) NOT NULL,
		objContent varbinary(MAX) NULL,
		objType INT NOT NULL,
		objTypeName VARCHAR(50)  NULL,
		deployOnParent BIT NOT NULL,
		modifiedDate datetime NULL CONSTRAINT BABIZAGICATALOG_DF1 DEFAULT (getdate()),
		modifiedByUser VARCHAR(100) NULL,
		mtdVersion INT NULL CONSTRAINT BABIZAGICATALOG_DFG DEFAULT (0),
		rootObject uniqueidentifier NULL,
		changeSetId INT NULL,
		objContentResolved varbinary(MAX) NULL,
		deleted BIT NULL,
		contentFormat TINYINT CONSTRAINT BABIZAGICATALOG_DFG2 DEFAULT (0)
	);		
	CREATE CLUSTERED INDEX BABIZAGICATALOG_CIDX ON BABIZAGICATALOG (rootObject, guidObject);
	CREATE INDEX BABIZAGICATALOG_IDX2 ON BABIZAGICATALOG (rootObject,changeSetId) INCLUDE (guidObject, guidObjectParent, objName, objType, objTypeName, deleted) WITH (SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF);
	PRINT ('END: CREATE TABLE BABIZAGICATALOG')
END
GO

IF not exists (select 1 from dbo.sysobjects where id = object_id(N'BACATALOGREFERENCE') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN		
	PRINT ('BEGIN: CREATE TABLE BACATALOGREFERENCE')
	CREATE TABLE BACATALOGREFERENCE (
		rootObject uniqueidentifier,
		guidPointer uniqueidentifier,
		guidObjectRef uniqueidentifier,
		guidObjectTarget uniqueidentifier NOT NULL,
		deleted BIT NULL
	);
	CREATE CLUSTERED INDEX BACATALOGREFERENCE_CIDX ON BACATALOGREFERENCE (rootObject, guidObjectRef);
	CREATE INDEX BACATALOGREFERENCE_IDX ON BACATALOGREFERENCE (guidPointer, guidObjectRef);
	PRINT ('END: CREATE TABLE BACATALOGREFERENCE')	
END
GO

IF not exists (select 1 from dbo.sysobjects where id = object_id(N'BATAGVALUE') and OBJECTPROPERTY(id, N'IsUserTable') = 1)	
BEGIN		
	PRINT('BEGIN: CREATE TABLE BATAGVALUE')
	CREATE TABLE BATAGVALUE
	(
		rootObject uniqueidentifier,
		tagType uniqueidentifier NOT NULL,
		tagName VARCHAR(50) NOT NULL,
		taggedObject uniqueidentifier NOT NULL,		  
		value VARCHAR(4000) NOT NULL,
		deleted BIT NULL
	);
	CREATE CLUSTERED INDEX BATAGVALUE_CIDX ON BATAGVALUE (rootObject, taggedObject);
	CREATE INDEX BATAGVALUE_IDX ON BATAGVALUE (taggedObject, deleted);
	PRINT('END: CREATE TABLE BATAGVALUE')	
END
GO

IF not exists (select 1 from dbo.sysobjects where id = object_id(N'BACATALOGINDEXEDOBJECTS') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
	PRINT ('BEGIN: CREATE TABLE BACATALOGINDEXEDOBJECTS')
	CREATE TABLE dbo.BACATALOGINDEXEDOBJECTS(
		rootObject uniqueidentifier,
		name varchar(36) NOT NULL,
		sourceGuid uniqueidentifier NOT NULL,
		targetGuid uniqueidentifier NOT NULL,
		deleted BIT NULL
	);
	CREATE CLUSTERED INDEX BACATALOGINDEXEDOBJECTS_CIDX ON BACATALOGINDEXEDOBJECTS (rootObject, targetGuid);
	CREATE INDEX BACATALOGINDEXEDOBJECTS_IDX ON BACATALOGINDEXEDOBJECTS (sourceGuid);
	CREATE INDEX BACATALOGINDEXEDOBJECTS_IDX2 ON BACATALOGINDEXEDOBJECTS (targetGuid,sourceGuid);
	CREATE INDEX BACATALOGINDEXEDOBJECTS_IDX3 ON BACATALOGINDEXEDOBJECTS (targetGuid, deleted) INCLUDE(name, sourceGuid) WITH (SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF);
	PRINT ('END: CREATE TABLE BACATALOGINDEXEDOBJECTS')
END
GO

/*IF not exists (select 1 from dbo.sysobjects where id = object_id(N'BACHANGESETLOG') and OBJECTPROPERTY(id, N'IsUserTable') = 1)	
BEGIN		
	PRINT('BEGIN: CREATE TABLE BACHANGESETLOG')
	CREATE TABLE BACHANGESETLOG
	(
		guidObject uniqueidentifier NOT NULL,
		changeSetId INT NOT NULL,
		changeSetDate datetime NOT NULL CONSTRAINT BACHANGESETLOG_DF1 DEFAULT (getdate()),
		changeSetOwner VARCHAR(100) NOT NULL,		
		objContent NTEXT NULL
	);
	CREATE INDEX BACHANGESETLOG_IDX ON BACHANGESETLOG (guidObject);
	PRINT('END: CREATE TABLE BACHANGESETLOG')	
END
GO*/
/************************************************************************/

/****************************CATALOG VIEWS*******************************/
PRINT('BEGIN: Create vwBA_Catalog_BABIZAGICATALOG view');

IF exists (select * from dbo.sysobjects where id = object_id('vwBA_Catalog_BABIZAGICATALOG') and OBJECTPROPERTY(id, 'IsView') = 1)
	EXEC(' drop view vwBA_Catalog_BABIZAGICATALOG ');

EXEC('
CREATE VIEW vwBA_Catalog_BABIZAGICATALOG 
AS
SELECT guidObject, guidObjectParent, objName, objContent, objType, 
	   deployOnParent, modifiedDate, modifiedByUser, mtdVersion, ''0'' as ''IsOverride''
FROM BABIZAGICATALOG
');

PRINT('END: Create vwBA_Catalog_BABIZAGICATALOG view');
GO

PRINT('BEGIN: Create vwBA_Catalog_BAREFERENCE view');
if exists (select * from dbo.sysobjects where id = object_id('vwBA_Catalog_BAREFERENCE') and OBJECTPROPERTY(id, 'IsView') = 1)
	EXEC (' DROP view vwBA_Catalog_BAREFERENCE ');

EXEC('
CREATE VIEW vwBA_Catalog_BAREFERENCE 
AS
SELECT guidPointer, guidObjectRef, guidObjectTarget, ''0'' as ''IsOverride''
FROM BACATALOGREFERENCE
');

PRINT('END: Create vwBA_Catalog_BAREFERENCE view');
GO

PRINT('BEGIN: Create vwBA_Catalog_BATAGVALUE view');

IF exists (select * from dbo.sysobjects where id = object_id('vwBA_Catalog_BATAGVALUE') and OBJECTPROPERTY(id, 'IsView') = 1)
	EXEC(' drop view vwBA_Catalog_BATAGVALUE ');

EXEC('CREATE VIEW vwBA_Catalog_BATAGVALUE 
AS
SELECT tagType, taggedObject, value, ''0'' as ''IsOverride''
FROM BATAGVALUE
');

PRINT('END: Create vwBA_Catalog_BATAGVALUE view');
GO
/************************************************************************/

/****************************CATALOG MERGE*****************************/
IF NOT EXISTS (SELECT * FROM sys.types st JOIN sys.schemas ss ON st.schema_id = ss.schema_id WHERE st.name = N'BizagiCatalogType' AND ss.name = N'dbo')
BEGIN
	PRINT ('BEGIN: CREATE TYPE BizagiCatalogType')
	CREATE TYPE BizagiCatalogType AS TABLE (
		guidObject uniqueidentifier,
		guidObjectParent uniqueidentifier NULL,
		objName VARCHAR(256) NOT NULL,
		objContent varbinary(MAX) NULL,
		objType INT NOT NULL,
		objTypeName VARCHAR(50)  NULL,
		deployOnParent BIT NOT NULL,
		modifiedDate datetime NULL,
		modifiedByUser VARCHAR(100) NULL,
		mtdVersion INT NULL,
		rootObject uniqueidentifier NOT NULL,
		changeSetId INT NULL,
		objContentResolved varbinary(MAX) NULL,
		deleted BIT NULL,
		contentFormat TINYINT,
		PRIMARY KEY CLUSTERED
		(		
			rootObject ASC,
			guidObject ASC
		)
	);
	PRINT ('END: CREATE TYPE BizagiCatalogType')
END
GO

IF NOT EXISTS (SELECT * FROM sys.types st JOIN sys.schemas ss ON st.schema_id = ss.schema_id WHERE st.name = N'TagValueType' AND ss.name = N'dbo')
BEGIN
	PRINT ('BEGIN: CREATE TYPE TagValueType')
	CREATE TYPE TagValueType AS TABLE (
		rootObject uniqueidentifier , 
		tagType uniqueidentifier NOT NULL,
		tagName VARCHAR(50) NOT NULL,
		taggedObject uniqueidentifier NOT NULL,		  
		value VARCHAR(4000) NOT NULL,
		deleted BIT NULL
	);
	PRINT ('END: CREATE TYPE TagValueType')
END
GO

IF NOT EXISTS (SELECT * FROM sys.types st JOIN sys.schemas ss ON st.schema_id = ss.schema_id WHERE st.name = N'CatalogIndexedObjectsType' AND ss.name = N'dbo')
BEGIN
	PRINT ('BEGIN: CREATE TYPE CatalogIndexedObjectsType')
	CREATE TYPE CatalogIndexedObjectsType AS TABLE (
		rootObject uniqueidentifier,
		name varchar(36) NOT NULL,
		sourceGuid uniqueidentifier NOT NULL,
		targetGuid uniqueidentifier NOT NULL,
		deleted BIT NULL
	);
	PRINT ('END: CREATE TYPE CatalogIndexedObjectsType')
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.sysobjects WHERE id = OBJECT_ID(N'spBA_SQL_BizagiCatalogMerge'))
BEGIN   
	PRINT ('BEGIN: CREATE PROCEDURE spBA_SQL_BizagiCatalogMerge')
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
				IF @RootObject IS NOT NULL
				BEGIN
					UPDATE BABIZAGICATALOG SET changeSetId = @ChangeSetId WHERE rootObject = @RootObject AND guidObject = @RootObject;
				END
			COMMIT;
		')
	PRINT ('END: CREATE PROCEDURE spBA_SQL_BizagiCatalogMerge')
END
GO
/************************************************************************/

/******TYPES AND PROCEDURES FOR REFERENCE PROCESSING*******/

IF NOT  EXISTS (SELECT * FROM sys.types st JOIN sys.schemas ss ON st.schema_id = ss.schema_id WHERE st.name = N'NewContentsTable' AND ss.name = N'dbo')
BEGIN
	PRINT ('BEGIN: CREATE TYPE NewContentsTable')
	CREATE TYPE NewContentsTable AS TABLE(
		rootObject uniqueidentifier NOT NULL,
		guidObject uniqueidentifier NOT NULL,
		objContentExpanded varbinary(MAX) NULL
	)
	PRINT ('END: CREATE TYPE NewContentsTable')
END
GO

IF NOT EXISTS (SELECT * FROM sys.types st JOIN sys.schemas ss ON st.schema_id = ss.schema_id WHERE st.name = N'ReferencesTable' AND ss.name = N'dbo')
BEGIN
	PRINT ('BEGIN: CREATE TYPE ReferencesTable')
	CREATE TYPE ReferencesTable AS TABLE(
		rootObject uniqueidentifier,
		guidPointer uniqueidentifier NOT NULL,
		guidObjectRef uniqueidentifier NOT NULL,
		guidObjectTarget uniqueidentifier NOT NULL
	)
	PRINT ('END: CREATE TYPE ReferencesTable')
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.sysobjects WHERE id = OBJECT_ID(N'spBA_SQL_UpdateRefsAndContents'))
BEGIN 
	PRINT ('BEGIN: CREATE STORED PROCEDURE spBA_SQL_UpdateRefsAndContents')
	EXEC('CREATE PROCEDURE [dbo].[spBA_SQL_UpdateRefsAndContents]
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
	PRINT ('END: CREATE STORE PROCEDURE spBA_SQL_UpdateRefsAndContents')
END
GO

/***************TYPES AND PROCEDURES FOR EXPORT-IMPORT*****************/

IF NOT EXISTS (SELECT * FROM sys.types st JOIN sys.schemas ss ON st.schema_id = ss.schema_id WHERE st.name = N'IEObjectsTable' AND ss.name = N'dbo')
BEGIN
	PRINT ('BEGIN: CREATE TYPE IEObjectsTable')
	CREATE TYPE IEObjectsTable AS TABLE(
		guidObject uniqueidentifier NULL,
		guidObjectParent uniqueidentifier NULL,
		objName varchar(256) NOT NULL,
		objContent varbinary(MAX) NULL,
		objType int NOT NULL,
		objTypeName VARCHAR(50) NULL,
		deployOnParent bit NOT NULL,
		modifiedDate datetime NULL,
		modifiedByUser varchar(100) NULL,
		mtdVersion int NULL,
		rootObject uniqueidentifier NULL,
		changeSetId int NULL,
		objContentResolved varbinary(MAX) NULL,
		deleted bit NOT NULL,
		contentFormat TINYINT
	)
	PRINT ('END: CREATE TYPE IEObjectsTable')
END
GO

IF NOT  EXISTS (SELECT * FROM sys.types st JOIN sys.schemas ss ON st.schema_id = ss.schema_id WHERE st.name = N'IEReferencesTable' AND ss.name = N'dbo')
BEGIN
	PRINT ('BEGIN: CREATE TYPE IEReferencesTable')
	CREATE TYPE IEReferencesTable AS TABLE(
		rootObject uniqueidentifier,
		guidPointer uniqueidentifier NULL,
		guidObjectRef uniqueidentifier NULL,
		guidObjectTarget uniqueidentifier NOT NULL,
		deleted bit NULL
	)
	PRINT ('END: CREATE TYPE IEReferencesTable')
END
GO

IF NOT EXISTS (SELECT * FROM sys.types st JOIN sys.schemas ss ON st.schema_id = ss.schema_id WHERE st.name = N'IEIndexesTable' AND ss.name = N'dbo')
BEGIN
	PRINT ('BEGIN: CREATE TYPE IEIndexesTable')
	CREATE TYPE IEIndexesTable AS TABLE(
		rootObject uniqueidentifier,
		name varchar(36) NOT NULL,
		sourceGuid uniqueidentifier NOT NULL,
		targetGuid uniqueidentifier NOT NULL,
		deleted bit NULL
	)
	PRINT ('END: CREATE TYPE IEIndexesTable')
END
GO

IF NOT EXISTS (SELECT * FROM sys.types st JOIN sys.schemas ss ON st.schema_id = ss.schema_id WHERE st.name = N'IETagsTable' AND ss.name = N'dbo')
BEGIN
	PRINT ('BEGIN: CREATE TYPE IETagsTable')
	CREATE TYPE IETagsTable AS TABLE(
		rootObject uniqueidentifier,
		tagType uniqueidentifier NOT NULL,
		tagName VARCHAR(50) NOT NULL,
		taggedObject uniqueidentifier NOT NULL,
		value varchar(4000) NOT NULL,
		deleted bit NULL
	)
	PRINT ('END: CREATE TYPE IETagsTable')
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.sysobjects WHERE id = OBJECT_ID(N'spBA_SQL_ImportPackage'))
BEGIN 
	PRINT ('BEGIN: CREATE STORED PROCEDURE spBA_SQL_ImportPackage')
	EXEC('CREATE PROCEDURE spBA_SQL_ImportPackage
				@IEObjectsTable IEObjectsTable READONLY ,
				@IEReferencesTable IEReferencesTable READONLY,
				@IEIndexesTable IEIndexesTable READONLY , 
				@IDTagsTable IETagsTable READONLY
		AS
		BEGIN
			SET NOCOUNT ON;
			
			INSERT INTO BABIZAGICATALOG
					   (guidObject
					   ,guidObjectParent
					   ,objName
					   ,objContent
					   ,objType
					   ,objTypeName
					   ,deployOnParent
					   ,modifiedDate
					   ,modifiedByUser
					   ,mtdVersion
					   ,rootObject
					   ,changeSetId
					   ,objContentResolved
					   ,deleted
					   ,contentFormat)
			SELECT 	   guidObject
					   ,guidObjectParent
					   ,objName
					   ,objContent
					   ,objType
					   ,objTypeName
					   ,deployOnParent
					   ,modifiedDate
					   ,modifiedByUser
					   ,mtdVersion
					   ,rootObject
					   ,changeSetId
					   ,objContentResolved
					   ,deleted
					   ,contentFormat
			FROM @IEObjectsTable;

		
			INSERT INTO BACATALOGREFERENCE(rootObject, guidPointer,guidObjectRef,guidObjectTarget,deleted)
					SELECT rootObject, guidPointer, guidObjectRef ,guidObjectTarget ,deleted FROM @IEReferencesTable;
		
			INSERT INTO BACATALOGINDEXEDOBJECTS (rootObject, name,sourceGuid,targetGuid,deleted)
					SELECT rootObject,name,sourceGuid,targetGuid,deleted FROM @IEIndexesTable;

			INSERT INTO BATAGVALUE (rootObject, tagType, tagName ,taggedObject ,value ,deleted)
					SELECT rootObject, tagType, tagName ,taggedObject ,value ,deleted FROM @IDTagsTable;

						
		END')
	PRINT ('END: CREATE STORED PROCEDURE spBA_SQL_ImportPackage')
END
GO


/***************STORE PROCEDURE FOR SHARDLETSIZE*****************/

IF not exists (select 1 from dbo.sysobjects where id = object_id(N'SHARDLETSIZE') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
	PRINT ('BEGIN: CREATE TABLE SHARDLETSIZE')

	CREATE TABLE SHARDLETSIZE(shardletID uniqueidentifier NULL, size bigint NULL ) 

	PRINT ('END: CREATE TABLE SHARDLETSIZE')
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.sysobjects WHERE id = OBJECT_ID(N'spBA_SQL_UpdateShardletSize'))
BEGIN 
	PRINT ('BEGIN: CREATE STORED PROCEDURE spBA_SQL_UpdateShardletSize')
	EXEC('CREATE PROCEDURE spBA_SQL_UpdateShardletSize
	AS
	BEGIN

		DELETE FROM SHARDLETSIZE

	--    INSERT INTO SHARDLETSIZE(shardletID, size) 
			SELECT rootObject AS shardLetGuid, SUM( ISNULL( DATALENGTH(objContent) , 0) + ISNULL( DATALENGTH(objContentResolved) , 0) ) AS shardLetSize
			FROM BABIZAGICATALOG
			GROUP BY rootObject

	END')
	PRINT ('END: CREATE STORED PROCEDURE spBA_SQL_UpdateShardletSize')
END
GO

-- STATISTICS TEMPORAL STUFF
IF not exists (select 1 from dbo.sysobjects where id = object_id(N'BACATALOGSTATISTICS') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN	
	PRINT ('BEGIN: Creating BACATALOGSTATISTICS table')
	CREATE TABLE BACATALOGSTATISTICS(
		guidObject uniqueidentifier NOT NULL,
		size int NULL,
		compressedSize int NULL,
		timeConvertToBytes int NULL,
		timeCompressBytes int NULL
	);
	PRINT ('END: Creating BACATALOGSTATISTICS table')
END
GO

IF NOT EXISTS (SELECT * FROM sys.types st JOIN sys.schemas ss ON st.schema_id = ss.schema_id WHERE st.name = N'BACatalogStatisticsType' AND ss.name = N'dbo')
BEGIN
	PRINT ('BEGIN: CREATE TYPE BACatalogStatisticsType')
	CREATE TYPE BACatalogStatisticsType AS TABLE (
		guidObject uniqueidentifier NOT NULL,
		size int NULL,
		compressedSize int NULL,
		timeConvertToBytes int NULL,
		timeCompressBytes int NULL
	);
	PRINT ('END: CREATE TYPE BACatalogStatisticsType')
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.sysobjects WHERE id = OBJECT_ID(N'spBA_SQL_SaveStatistics'))
BEGIN 
	PRINT ('BEGIN: CREATE STORED PROCEDURE spBA_SQL_SaveStatistics')
	EXEC('CREATE PROCEDURE dbo.spBA_SQL_SaveStatistics
		@statistics BACatalogStatisticsType READONLY
	AS
	BEGIN
			MERGE INTO BACATALOGSTATISTICS A
			USING @statistics Tmp ON Tmp.guidObject = A.guidObject
			WHEN MATCHED THEN
				UPDATE SET	guidObject = Tmp.guidObject,           
							size = Tmp.size, 
							compressedSize = Tmp.compressedSize, 
							timeConvertToBytes = Tmp.timeConvertToBytes, 
							timeCompressBytes = Tmp.timeCompressBytes
			WHEN NOT MATCHED THEN
			INSERT (guidObject, size, compressedSize, timeConvertToBytes, timeCompressBytes) 
			VALUES (Tmp.guidObject, Tmp.size, Tmp.compressedSize, Tmp.timeConvertToBytes, Tmp.timeCompressBytes);
	END')
	PRINT ('END: CREATE STORED PROCEDURE spBA_SQL_SaveStatistics')
END
GO