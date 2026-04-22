/**
 * Script de diagnóstico para imágenes
 * Ejecuta esto en la consola del navegador para verificar qué está pasando
 */

export async function debugProductImages() {
  console.log('🔍 === DIAGNÓSTICO DE IMÁGENES ===\n');

  try {
    // 1. Obtener un producto
    const res = await fetch('http://localhost:8080/api/products/1', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    const data = await res.json();
    const product = data.data;

    console.log('📦 Producto obtenido:', product.name);
    console.log('🖼️  Campo imageUrl:', product.imageUrl);
    console.log('---');

    // 2. Verificar si la URL es válida
    if (product.imageUrl) {
      console.log('✅ Tiene URL de imagen');
      console.log('📍 URL:', product.imageUrl);

      // 3. Intentar descargar la imagen
      const imgRes = await fetch(product.imageUrl);
      if (imgRes.ok) {
        console.log('✅ La URL es accesible (status:', imgRes.status + ')');
      } else {
        console.log('❌ La URL no es accesible (status:', imgRes.status + ')');
      }
    } else {
      console.log('❌ imageUrl está vacío o null');
    }

    console.log('\n📋 Información completa del producto:');
    console.table({
      'ID': product.id,
      'Nombre': product.name,
      'Precio': product.price,
      'Stock': product.stock,
      'ImageUrl': product.imageUrl,
      'Brand': product.brandName,
      'Category': product.categoryName
    });

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Exportar para usar en consola
window.debugProductImages = debugProductImages;
