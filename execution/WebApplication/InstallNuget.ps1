param([Parameter(Mandatory=$true)][string]$projectDir, [string]$NugetName="bizagi.jquery", [string]$OutDir)
$global:NugetFullname = $null
$global:NugetVersion = $null
$global:UpdateComplete = $true
$global:UpdateProduction = $false
$global:ProjectName = Split-Path $projectDir -Leaf
$global:Studio = $true
$global:Bpm = $false
if( $global:ProjectName.ToLower().Contains("studio"))
{
    $global:Studio = $true
    if(-not $OutDir)
    {
        $OutDir=[io.path]::Combine($projectDir, "bin", "Release_x64")
    }
    $global:OutputDir = [io.path]::Combine($OutDir,"FormModelerWeb")
}
elseif($global:ProjectName.ToLower().Contains("bpm") )
{
    $global:Bpm = $true
    $global:OutputDir = $projectDir
}

function Find-NugetFullNameAndVersion
{
    param( [Parameter(Mandatory=$true)][string]$ProjectDir, [Parameter(Mandatory=$true)][string]$ShortNugetName )
    
    $JqueryPackagePattern = "id=`"((.(?!`"))*$shortNugetName((?!`").)*)`"\s*version=`"([\d.]*([a-zA-Z\-]+)?)`""
    
    $PackagesConfigFiles = Get-ChildItem -Path $ProjectDir -Filter "packages*.config" -File | select -Property FullName
    foreach( $CurrentPackageConfig in $packagesConfigFiles)
    {    
        $CurrentPackageConfigContent = Get-Content $CurrentPackageConfig.FullName | Out-String        
        if( $CurrentPackageConfigContent -match $JqueryPackagePattern)
        {
            $global:NugetFullname = $matches[1]
            $global:NugetVersion = $matches[4]
            Write-Host "jquery nuget found: $global:NugetFullname (v$global:NugetVersion)"
            break
        }
    }
}

function CheckIf-JqueryNeedUpdate
{
    param( [Parameter(Mandatory=$true)][string]$projectDir)
    $SourceModuleDefinitionFullPath = [io.path]::Combine($projectDir, "jquery", "bizagi.module.definition.json.txt")  
    $ProductionModuleDefinitionFullPath = [io.path]::Combine($global:OutputDir, "production", "bizagi.module.definition.json.txt") 
    if($global:Studio)
    {
        $SourceModuleDefinitionFullPath = [io.path]::Combine($global:OutputDir, "bizagi.module.definition.json.txt")
        $ProductionModuleDefinitionFullPath = [io.path]::Combine($global:OutputDir, "jquery", "production", "bizagi.module.definition.json.txt")
    } 
    
    $projectName = Split-Path $projectDir -Leaf
    

    #If source code was find then only will updates production directories and app.cache file 
    #because could there are pending changes in other files
    $skipUpdate = $false
    if( Test-Path -Path $SourceModuleDefinitionFullPath )
    {
        $global:UpdateComplete = $false
        $moduleDefinitionJson = (Get-Content $SourceModuleDefinitionFullPath | ConvertFrom-Json)
        $skipUpdate = $moduleDefinitionJson.skipUpdate
        if($skipUpdate)
        {
            #Default value is false
            #$global:UpdateProduction = $false 
            Write-Host "skipUpdate was setted as true in moduleDefinitionJson. jquery\production directory will not updated"           
        }        
    }
    If( (Test-Path -Path $ProductionModuleDefinitionFullPath) -and -not $skipUpdate)
    {
        $moduleDefinitionJson = (Get-Content $ProductionModuleDefinitionFullPath | ConvertFrom-Json)
        $build = $moduleDefinitionJson.build        
        if($build)
        {
            if($nugetVersion -eq $build)
            {
                echo "jquery is up to date"
                $global:UpdateComplete = $false
            }   
            else
            {
                 $global:UpdateProduction = $true
            }        
        }
        else
        {
            throw "ERROR: build number not found in module definition located at $moduleDefinitionFullPath"
        }
    }
    else
    {
        if(-not $skipUpdate)
        {
            Write-Host "File not found $ProductionModuleDefinitionFullPath`nProduction directories will be updated"
            $global:UpdateProduction = $true
        }
        
    }   
}

function Get-UserNugetPackagesDirectory
{
    param ([string]$NugetName)
    return [io.path]::combine($env:USERPROFILE, ".nuget", "packages", "$NugetName")
}

function Get-SolutionPackagesDirectory
{
    param ( [Parameter(Mandatory=$true)][string] $ProjectDir)
    $CurrentDirectory = $ProjectDir
    [bool] $SolutionFinded = $false
    while ( -not($SolutionFinded) )
    {
        $solutionFiles = Get-ChildItem -Path $CurrentDirectory -File -Filter "*.sln"
        if ($solutionFiles.Count -gt 0 )
        {
            $SolutionDirectory = $CurrentDirectory
            $SolutionFinded = $true
        }
        else
        {
            try
            {
                $CurrentDirectory = [io.path]::combine($CurrentDirectory, "..")
                $validPath = Test-Path $CurrentDirectory -ErrorAction Stop
            }
            catch
            {
                $SolutionFinded = $true
                throw "Could not find solution directory from project directory specified ($ProjectDir)"
            }
        }
    }
    
    $SolutionPackagesDirectory = [io.path]::combine($SolutionDirectory, "packages")
    if( Test-Path $SolutionPackagesDirectory)
    {
        return $SolutionPackagesDirectory
    }
}

function Copy-Directories
{
    param([string]$source, [string]$destination)
    robocopy $source $destination $file /S /NP /NFL /NDL     
}

function CleanAndCopy-Directories
{
    param([string]$source, [string]$destination)
    if ( Test-Path -Path $destination)
    {
        Write-Host "Removing $destination ..."
        Remove-Item -Path $destination -Recurse -Force
    }
    Copy-Directories -source $source -destination $destination
}

function Copy-JQueryContentToProject
{
    param([string]$projectDir, [string]$nugetName = $global:NugetFullname, [string]$nugetVersion = $global:NugetVersion)
    
    if($global:Bpm)
    {
        Write-Host "Updating jquery production directories"
        $copyPaths = [io.path]::combine("jquery", "production"),
                     [io.path]::combine("jquery", "workportalflat", "production"),
                     [io.path]::combine("jquery", "quickprocess", "dist") 
        $appCache = "bizagi.cache.appcache"
    }
    else
    {
        $copyPaths = [io.path]::Combine("jquery", "production")
    } 
    
    $nugetDirectoryWasResolved = $false
    $t1 = (Get-SolutionPackagesDirectory -ProjectDir $projectDir)
    $nugetDirectory = [io.path]::combine($t1, "$nugetName.$nugetVersion")
    if( -not (Test-Path $nugetDirectory) )
    {
        $t2 = (Get-UserNugetPackagesDirectory -NugetName $nugetName)
        $nugetDirectory = [io.path]::Combine($t2, $nugetVersion)
    }
    if(Test-Path $nugetDirectory )
    {
        $nugetDirectoryWasResolved = $true
    }

    if($nugetDirectoryWasResolved)
    {
        Write-Host "resolved nuget installation path: $nugetDirectory" 

        if(-not($global:UpdateComplete))
        {
            if($global:Bpm)
            {
                robocopy ([io.path]::Combine($nugetDirectory,"BizAgiBPM")) $projectDir $appCache /NFL /NP
                $nugetDirectory = [io.path]::Combine($nugetDirectory, $global:ProjectName) 
            }
            foreach($productionDirectory in $copyPaths)
            {  
                CleanAndCopy-Directories -source ([io.path]::Combine($nugetDirectory, $productionDirectory)) -destination ([io.path]::combine($global:OutputDir,$productionDirectory))
            }
        }
        else
        {
            if($global:Bpm)
            {
                $sourceDirectory = [io.path]::Combine($nugetDirectory, $global:ProjectName)                
                foreach($productionDirectory in $copyPaths)
                {  
                    CleanAndCopy-Directories -source ([io.path]::Combine($sourceDirectory, $productionDirectory)) -destination ([io.path]::combine($global:OutputDir,$productionDirectory))
                }
                Copy-Directories -source $sourceDirectory -destination $global:OutputDir
            }
            else
            {
                $sourceDirectory = [io.path]::Combine($nugetDirectory, "jquery") 
                Copy-Directories -source $sourceDirectory -destination ([io.path]::Combine($global:OutputDir, "jquery"))
            }
        }
                       
    } 
    else
    {
        throw "ERROR: Nuget $nugetName with version $nugetVersion was not found in your machine. Please intall it from package manager inside VS or run TFSUtility for restore it"
    }  
}

function Remove-FoldersByNameExceptLastNAndPattern
{
    param( [string]$Path, [string]$NamePattern, [string]$ExceptPattern, [int]$LastNToMaintain )
    $directories = Get-ChildItem -Path $Path -Directory | where {$_.Name -like "$NamePattern*" -and  $_.Name -notlike "$ExceptPattern*" }  | Sort-Object -Property LastWriteTime | select -Property FullName
    $ItemsToDelete = $directories.Length - $LastNToMaintain 
    if ($ItemsToDelete -gt 0 )
        {
            $CacheType = "solution"
            if($Path -like "$env:USERPROFILE*") { $CacheType = "user" }
            Write-Host "Cleaning $CacheType nuget cache: $ItemsToDelete items to delete"
            for ($i = 0; $i -lt $ItemsToDelete; $i++)
            {
                $CurrentPath = $directories[$i].FullName
                Write-Host "`tDeleting $CurrentPath ..."
                Remove-Item -Path $CurrentPath -Recurse -Force
            }
        }
    
    }

function Clean-PreviousNugetVersions
{
    param ([string]$nugetName=$global:NugetFullname, [string]$nugetVersion=$global:NugetVersion, [string]$ProjectDir )
    $UserNugetDirectory = Get-UserNugetPackagesDirectory -NugetName $nugetName
    if(Test-Path $UserNugetDirectory)
    {
        Remove-FoldersByNameExceptLastNAndPattern -path $UserNugetDirectory -exceptPattern "$nugetVersion" -LastNToMaintain 5
    }
    $SolutionPackagesDir = Get-SolutionPackagesDirectory -ProjectDir $ProjectDir
    if (Test-Path $SolutionPackagesDir)
    {
        Remove-FoldersByNameExceptLastNAndPattern -Path $SolutionPackagesDir -NamePattern $nugetName -ExceptPattern "$nugetName.$nugetVersion" -LastNToMaintain 2   
    }    
}


function Main
{
    param( [string]$projectDir, [string]$NugetName)
    Find-NugetFullNameAndVersion -shortNugetName $NugetName -ProjectDir $projectDir
    CheckIf-JqueryNeedUpdate -projectDir $projectDir
    if($global:NugetFullname -and $global:NugetVersion)
    {
        if( $global:UpdateProduction -or $global:UpdateComplete )
        {
            Copy-JQueryContentToProject -projectDir $projectDir
        }
    }
    else
    {
        throw "ERROR: jquery nuget not found in packages.config files into project dir $projectDir"
    }
    Clean-PreviousNugetVersions -ProjectDir $projectDir

}

Main -projectDir $projectDir -NugetName $NugetName