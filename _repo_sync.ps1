$root = 'E:\c++\exchange-simulator'
$markerCpp = '// AstraX repo sync'
$markerPy = '# AstraX repo sync'
$markerMd = '<!-- AstraX repo sync -->'
$markerTxt = '# AstraX repo sync'

Get-ChildItem -Path $root -Recurse -File |
  Where-Object { $_.FullName -notmatch '\\(\.git|build|node_modules)\\' } |
  ForEach-Object {
    $file = $_

    switch -Regex ($file.Name) {
      '^package-lock\.json$' {
        $content = Get-Content -LiteralPath $file.FullName -Raw
        $content = $content -replace '"name": "exchange-dashboard"', '"name": "astrax-dashboard"'
        Set-Content -LiteralPath $file.FullName -Value $content
        return
      }
      '^package\.json$' {
        $json = Get-Content -LiteralPath $file.FullName -Raw | ConvertFrom-Json
        if ($json.PSObject.Properties.Name.Contains('author')) {
          $json.author = 'moneet'
        } else {
          $json | Add-Member -NotePropertyName author -NotePropertyValue 'moneet'
        }
        if (-not $json.PSObject.Properties.Name.Contains('description')) {
          $json | Add-Member -NotePropertyName description -NotePropertyValue 'AstraX frontend'
        }
        Set-Content -LiteralPath $file.FullName -Value ($json | ConvertTo-Json -Depth 20)
        return
      }
      '^CMakeLists\.txt$' {
        $marker = $markerTxt
      }
      default {
        switch ($file.Extension.ToLowerInvariant()) {
          '.py'  { $marker = $markerPy }
          '.cpp' { $marker = $markerCpp }
          '.hpp' { $marker = $markerCpp }
          '.js'  { $marker = $markerCpp }
          '.jsx' { $marker = $markerCpp }
          '.html' { $marker = $markerMd }
          '.md'  { $marker = $markerMd }
          '.txt' { $marker = $markerTxt }
          default { $marker = $null }
        }
      }
    }

    if ($null -eq $marker) {
      return
    }

    $content = Get-Content -LiteralPath $file.FullName -Raw
    if ($content -notmatch [regex]::Escape($marker) + '\s*$') {
      if ($content.Length -gt 0 -and -not $content.EndsWith("`n")) {
        $content += "`r`n"
      }
      $content += "`r`n$marker"
      Set-Content -LiteralPath $file.FullName -Value $content
    }
  }
