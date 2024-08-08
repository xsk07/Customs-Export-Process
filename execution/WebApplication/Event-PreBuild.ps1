param
(
    [string] $solutionDir = "$PSScriptRoot\.."
)
Set-ExecutionPolicy Unrestricted -Scope Process
$nuget = [System.IO.Path]::GetFullPath("$solutionDir\..\..\CITools\CIToolsClient\Tools\nuget.exe")
$nugetConf = [System.IO.Path]::GetFullPath("$solutionDir\..\..\CITools\CIToolsClient\Config\nuget.config")
$packagesFolderPath = [System.IO.Path]::GetFullPath("$solutionDir\packages")
$projectBizagiBPM = [System.IO.Path]::GetFullPath("$solutionDir\BizAgiBPM\")

function getFilteredVersion ($Major = "[0-9]+", $Minor = "[0-9]+", $Patch = "[0-9]+" ){
    $InputString = .$nuget list "Bizagi.ThemeBuilder" -ConfigFile $nugetConf -AllVersions
    $InputString = $InputString -replace "Using credentials from config. UserName: BizagiTFSSetup",""
    $InputString = $InputString -replace "Bizagi.ThemeBuilder",""
    $InputString = $InputString -replace " ",""
    $InputArray = $InputString.Split("\n")
    $Regex = "("+$Major+")\.("+$Minor+")\.("+$Patch+")"
    $resultArray = @()

    for (($i = 1); $i -lt $InputArray.Length-1; $i++)
    {
        $IsMatch = $InputArray[$i] -match $Regex
        if($IsMatch) {
            $resultArray += $InputArray[$i]
        }  
    }
    return $resultArray
}
$versions = getFilteredVersion -Major 1

if($versions -is [array]){
    $sortedVersionTags = $versions | sort {[version] $_}
    $version = $sortedVersionTags[$sortedVersionTags.Length-1]
}else{
    $version = $versions
}

Remove-Item "$packagesFolderPath\Bizagi.ThemeBuilder*" -Force -Recurse
Copy-Item -Path "$projectBizagiBPM\ThemeBuilder\README.md" -Force -Destination $projectBizagiBPM
Remove-Item "$projectBizagiBPM\ThemeBuilder\*" -Force -Recurse
.$nuget install "Bizagi.ThemeBuilder" -ConfigFile $nugetConf -Verbosity detailed -OutputDirectory $packagesFolderPath -Version $version
Copy-Item -Path "$packagesFolderPath\Bizagi.ThemeBuilder*\content\ThemeBuilder" -Recurse -Force -Destination $projectBizagiBPM
Move-Item -Path "$projectBizagiBPM\README.md" -Force -Destination "$projectBizagiBPM\ThemeBuilder"