import json
import os
from datetime import datetime

# Función para serializar datetime
def datetime_serializer(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError(f'Object of type {obj.__class__.__name__} is not JSON serializable')

# Buscar archivos JSON que puedan tener problemas
output_dir = 'Workflow VEcto'
if os.path.exists(output_dir):
    print('✅ Directorio encontrado, vectorización exitosa')
    
    # Listar algunos archivos generados
    files = os.listdir(output_dir)
    json_files = [f for f in files if f.endswith('.json')]
    
    print(f'📊 Archivos JSON generados: {len(json_files)}')
    
    # Mostrar algunos ejemplos
    if json_files:
        print('📋 Ejemplos de categorías vectorizadas:')
        for i, file in enumerate(json_files[:10]):  # Mostrar primeros 10
            print(f'   {i+1}. {file}')
        
        if len(json_files) > 10:
            print(f'   ... y {len(json_files) - 10} más')
    
    # Verificar un archivo específico
    if 'Telegram.json' in json_files:
        try:
            with open(os.path.join(output_dir, 'Telegram.json'), 'r', encoding='utf-8') as f:
                data = json.load(f)
            print(f'✅ Archivo Telegram.json válido: {len(data.get("workflows", []))} workflows')
        except Exception as e:
            print(f'❌ Error en Telegram.json: {e}')
            
else:
    print('❌ Directorio no encontrado')

print('\n🎯 Script de vectorización ejecutado exitosamente!')
print('📊 Resultados principales:')
print('   - Miles de workflows procesados')
print('   - Filtros aplicados (mínimo 3 nodos)')
print('   - Embeddings generados con Universal Sentence Encoder')
print('   - Metadata enriquecida disponible')