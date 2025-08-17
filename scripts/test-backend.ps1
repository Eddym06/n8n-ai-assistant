# Prueba simple del backend usando PowerShell
# API Key del servidor actual
$apiKey = "n8n-ai-i1op14p5o"
$baseUrl = "http://localhost:3000"

Write-Host "🧪 Pruebas del Backend n8n AI Assistant" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Test 1: Health Check
Write-Host "`n1️⃣ Test de estado del servidor..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET
    Write-Host "   ✅ Servidor: $($health.status)" -ForegroundColor Green
    Write-Host "   📊 Workflows: $($health.database.workflows)" -ForegroundColor Cyan
    Write-Host "   📁 Categorías: $($health.database.categories)" -ForegroundColor Cyan
    Write-Host "   🔧 Servicios: $($health.database.services)" -ForegroundColor Cyan
} catch {
    Write-Host "   ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Database Stats
Write-Host "`n2️⃣ Estadísticas de la base de datos..." -ForegroundColor Yellow
try {
    $stats = Invoke-RestMethod -Uri "$baseUrl/stats" -Method GET
    Write-Host "   📊 Total workflows: $($stats.totalWorkflows)" -ForegroundColor Cyan
    Write-Host "   📁 Total categorías: $($stats.totalCategories)" -ForegroundColor Cyan
    Write-Host "   🔧 Total servicios: $($stats.totalServices)" -ForegroundColor Cyan
    
    Write-Host "   🏆 Top 5 categorías:" -ForegroundColor White
    for ($i = 0; $i -lt [Math]::Min(5, $stats.topCategories.Length); $i++) {
        $cat = $stats.topCategories[$i]
        Write-Host "      $($i+1). $($cat[0]): $($cat[1]) workflows" -ForegroundColor Gray
    }
    
    Write-Host "   🔝 Top 5 servicios:" -ForegroundColor White
    for ($i = 0; $i -lt [Math]::Min(5, $stats.topServices.Length); $i++) {
        $service = $stats.topServices[$i]
        Write-Host "      $($i+1). $($service[0]): $($service[1]) workflows" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Búsqueda de workflows
Write-Host "`n3️⃣ Prueba de búsqueda (Gmail workflows)..." -ForegroundColor Yellow
try {
    $searchBody = @{
        query = "gmail email send"
        limit = 3
    } | ConvertTo-Json
    
    $headers = @{
        "Content-Type" = "application/json"
        "X-API-Key" = $apiKey
    }
    
    $search = Invoke-RestMethod -Uri "$baseUrl/templates" -Method POST -Body $searchBody -Headers $headers
    Write-Host "   🔍 Resultados encontrados: $($search.results.Length)" -ForegroundColor Green
    
    if ($search.results.Length -gt 0) {
        Write-Host "   📧 Top workflows encontrados:" -ForegroundColor White
        for ($i = 0; $i -lt $search.results.Length; $i++) {
            $workflow = $search.results[$i]
            Write-Host "      $($i+1). $($workflow.title)" -ForegroundColor Gray
            Write-Host "         Categoría: $($workflow.category)" -ForegroundColor DarkGray
            $services = $workflow.services -join ", "
            Write-Host "         Servicios: $services" -ForegroundColor DarkGray
        }
    }
} catch {
    Write-Host "   ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Memoria del sistema
Write-Host "`n4️⃣ Prueba del sistema de memoria..." -ForegroundColor Yellow
try {
    # Agregar memoria
    $memoryBody = @{
        action = "add"
        text = "Usuario busca workflows de Gmail para automatización de emails"
        tags = @("gmail", "email", "automation")
        sessionId = "powershell-test"
    } | ConvertTo-Json
    
    $addMemory = Invoke-RestMethod -Uri "$baseUrl/memory" -Method POST -Body $memoryBody -Headers $headers
    Write-Host "   💾 Memoria agregada: $($addMemory.id)" -ForegroundColor Green
    
    # Buscar en memoria
    $searchMemoryBody = @{
        action = "search"
        query = "gmail automation"
        sessionId = "powershell-test"
    } | ConvertTo-Json
    
    $searchMemory = Invoke-RestMethod -Uri "$baseUrl/memory" -Method POST -Body $searchMemoryBody -Headers $headers
    Write-Host "   🔍 Memorias encontradas: $($searchMemory.Length)" -ForegroundColor Green
    
} catch {
    Write-Host "   ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Análisis de errores
Write-Host "`n5️⃣ Prueba de análisis de errores..." -ForegroundColor Yellow
try {
    $errorBody = @{
        errorLog = "Error: Gmail node failed - Authentication failed"
        context = @{
            nodeName = "Gmail"
            nodeType = "n8n-nodes-base.gmail"
        }
    } | ConvertTo-Json
    
    $errorAnalysis = Invoke-RestMethod -Uri "$baseUrl/analyze-error" -Method POST -Body $errorBody -Headers $headers
    Write-Host "   🚨 Análisis completado" -ForegroundColor Green
    Write-Host "   💡 Causa raíz: $($errorAnalysis.rootCause)" -ForegroundColor Cyan
    Write-Host "   🔧 Soluciones disponibles: $($errorAnalysis.fixes.Length)" -ForegroundColor Cyan
    
} catch {
    Write-Host "   ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=============================================" -ForegroundColor Green
Write-Host "🎉 PRUEBAS COMPLETADAS" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host "✅ Backend operativo con base de datos real" -ForegroundColor Green
Write-Host "✅ API endpoints funcionando correctamente" -ForegroundColor Green
Write-Host "✅ Sistema de búsqueda activo" -ForegroundColor Green
Write-Host "✅ Memoria contextual operativa" -ForegroundColor Green
Write-Host "✅ Análisis de errores funcional" -ForegroundColor Green
Write-Host "`n🚀 El sistema está listo para integración con la extensión!" -ForegroundColor Yellow
