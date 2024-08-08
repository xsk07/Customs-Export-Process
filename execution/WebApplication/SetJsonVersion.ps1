param
(
    [parameter(Mandatory=$true)] [string]$sourceDir,
    [parameter(Mandatory=$true)] [string]$platform

)

$script:ErrorActionPreference = 'Stop';

$sourceFile = "$sourceDir\..\..\GlobalOutput\$platform\Vision.Defs.dll";
$targetFile = "$sourceDir\jquery\version.json.txt";
$definitionFile = "$sourceDir\jquery\bizagi.module.definition.json.txt";

$fileVersion = [System.Diagnostics.FileVersionInfo]::GetVersionInfo($sourceFile).FileVersion;

$json = Get-Content $definitionFile | Out-String | ConvertFrom-Json
$channel = $json.channel

$buildText = '"build": "' + $($fileVersion) + '", ';
$channelText = '"channel": "' + $($channel) + '"';

Set-ItemProperty $targetFile -name IsReadOnly -value $false
Set-Content -path $targetFile -value "{", $buildText, $channelText, "}";
Set-ItemProperty $targetFile -name IsReadOnly -value $true