param
(
	[string] $buildConfiguration = "Debug",
	[string] $platform = "x64",
	[string] $solutionDir = "$PSScriptRoot\..",
	[string] $targetDir = "bin\x64\Debug"
)

Set-ExecutionPolicy Unrestricted -Scope Process

$commonNugetFolder = [System.IO.Path]::GetFullPath("$PSScriptRoot\..\..\CommonReferences\nuget")
if (Test-Path $commonNugetFolder) {
    Write-Output "Copying sapnco from CommonReferences to Stubs folder"
    $source = [System.IO.Path]::GetFullPath("$PSScriptRoot\..\..\CommonReferences\nuget\SAPfake\sapnco.dll")
    $target = [System.IO.Path]::GetFullPath("$targetDir\Stubs\StubSAPConnector.dll")
    $stubsDir = [System.IO.Path]::GetFullPath("$targetDir\Stubs")
    Write-Output "source: $source"
    Write-Output "target: $target"
    New-Item -ItemType Directory -Path $stubsDir -Force
    Copy-Item $source $target -Force

    Write-Output "Deleting sapnco from target folder"
    $source = [System.IO.Path]::GetFullPath("$targetDir\sapnco.dll")
    Write-Output "source: $source"
    if (Test-Path $source) { Remove-Item $source }

    Write-Output "Copying SQLite.Interop.dll from CommonReferences to $targetDir folder"
    $source = [System.IO.Path]::GetFullPath("$PSScriptRoot\..\..\CommonReferences\nuget\x64\SQLite.Interop.dll")
    $target = [System.IO.Path]::GetFullPath("$targetDir\SQLite.Interop.dll")
    Write-Output "source: $source"
    Write-Output "target: $target"
    Copy-Item $source $target -Force
}

$nuget = [System.IO.Path]::GetFullPath("$solutionDir\..\..\CITools\CIToolsClient\Tools\nuget.exe")
$packageConfig = [System.IO.Path]::GetFullPath("$solutionDir\BizAgiBPM\packages.config")
$nugetConf = [System.IO.Path]::GetFullPath("$solutionDir\..\..\CITools\CIToolsClient\Config\nuget.config")
$packagesFolderPath = [System.IO.Path]::GetFullPath("$solutionDir\packages")
$slnPath = [System.IO.Path]::GetFullPath("$solutionDir\BizagiBPM.sln")

if (!(Test-Path packagesFolderPath)) {
    Write-Host "Packages folder not found!. executing nuget restore prior to updating"
    .$nuget restore $slnPath -ConfigFile $nugetConf
}

#.$nuget update $packageConfig -ConfigFile $nugetConf -Id 'bizagi.jquery.bpm.master' -Safe


&"$PSScriptRoot\InstallNuget.ps1" $PSScriptRoot
Copy-Item -Path "$PSScriptRoot\version.json.txt" -Destination "$PSScriptRoot\jquery" -Force

# Productivity: touch bin & obj files for avoiding VS recompile
$folder = "E:\dv\Core\Core\Source\BizAgiBPM\BizAgiBPM\obj\*.dll"
if (Test-Path $folder) {
    dir $folder -R | foreach { try { $_.CreationTime = [System.DateTime]::Now; $_.LastWriteTime = [System.DateTime]::Now } catch {} }
}
$folder = "E:\dv\Core\Core\Source\BizAgiBPM\BizAgiBPM\obj\*.pdb"
if (Test-Path $folder) {
    dir $folder -R | foreach { try { $_.CreationTime = [System.DateTime]::Now; $_.LastWriteTime = [System.DateTime]::Now } catch {} }
}
$folder = "E:\dv\Core\Core\Source\BizAgiBPM\BizAgiBPM\bin\*.dll"
if (Test-Path $folder) {
    dir $folder -R | foreach { try { $_.CreationTime = [System.DateTime]::Now; $_.LastWriteTime = [System.DateTime]::Now } catch {} }
}
$folder = "E:\dv\Core\Core\Source\BizAgiBPM\BizAgiBPM\bin\*.pdb"
if (Test-Path $folder) {
    dir $folder -R | foreach { try { $_.CreationTime = [System.DateTime]::Now; $_.LastWriteTime = [System.DateTime]::Now } catch {} }
}


Set-ExecutionPolicy Undefined -Scope Process

