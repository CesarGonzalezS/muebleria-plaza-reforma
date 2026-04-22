<template>
  <div>
    <AdminLayout title="Configurar Home" subtitle="Banners, galería y testimonios del sitio" icon="bi-house-gear">
      <template #actions>
        <button @click="saveAll" :disabled="saving" class="btn-primary">
          <span v-if="saving"><i class="bi bi-hourglass-split"></i> Guardando...</span>
          <span v-else><i class="bi bi-floppy"></i> Guardar cambios</span>
        </button>
      </template>

      <div v-if="loading" class="admin-loading">
        <div class="admin-spinner"></div>
        <p>Cargando configuración...</p>
      </div>

      <template v-else>
        <!-- ===== BANNERS ===== -->
        <section class="settings-section">
          <h3 class="settings-title"><i class="bi bi-images"></i> Banners del carousel (máx. 6)</h3>
          <p class="settings-hint">Imágenes que rotan en la cabecera del Home. Tamaño recomendado: 1920×600 px.</p>

          <div class="images-grid">
            <div v-for="(url, idx) in banners" :key="'banner-' + idx" class="image-slot">
              <img v-if="url" :src="url" class="slot-preview" :alt="'Banner ' + (idx + 1)" />
              <div v-else class="slot-empty">
                <i class="bi bi-image"></i>
                <span>Sin imagen</span>
              </div>
              <div class="slot-actions">
                <label class="btn-upload" :class="{ uploading: uploadingBanner[idx] }">
                  <i :class="uploadingBanner[idx] ? 'bi bi-arrow-repeat spin' : 'bi bi-cloud-upload'"></i>
                  {{ uploadingBanner[idx] ? 'Subiendo...' : 'Subir' }}
                  <input type="file" accept="image/*" class="hidden-file" @change="e => uploadBanner(e, idx)" :disabled="uploadingBanner[idx]" />
                </label>
                <input v-model="banners[idx]" type="text" class="url-input" placeholder="O pega URL aquí" />
                <button @click="removeBanner(idx)" class="btn-remove" title="Eliminar"><i class="bi bi-trash"></i></button>
              </div>
            </div>

            <button v-if="banners.length < 6" @click="banners.push('')" class="slot-add">
              <i class="bi bi-plus-lg"></i>
              <span>Agregar banner</span>
            </button>
          </div>
        </section>

        <!-- ===== GALERÍA ===== -->
        <section class="settings-section">
          <h3 class="settings-title"><i class="bi bi-grid-3x3-gap"></i> Galería de inspiración (máx. 9)</h3>
          <p class="settings-hint">Imágenes de la sección galería. Tamaño recomendado: 600×600 px.</p>

          <div class="images-grid">
            <div v-for="(url, idx) in gallery" :key="'gallery-' + idx" class="image-slot">
              <img v-if="url" :src="url" class="slot-preview" :alt="'Galería ' + (idx + 1)" />
              <div v-else class="slot-empty">
                <i class="bi bi-image"></i>
                <span>Sin imagen</span>
              </div>
              <div class="slot-actions">
                <label class="btn-upload" :class="{ uploading: uploadingGallery[idx] }">
                  <i :class="uploadingGallery[idx] ? 'bi bi-arrow-repeat spin' : 'bi bi-cloud-upload'"></i>
                  {{ uploadingGallery[idx] ? 'Subiendo...' : 'Subir' }}
                  <input type="file" accept="image/*" class="hidden-file" @change="e => uploadGallery(e, idx)" :disabled="uploadingGallery[idx]" />
                </label>
                <input v-model="gallery[idx]" type="text" class="url-input" placeholder="O pega URL aquí" />
                <button @click="removeGallery(idx)" class="btn-remove" title="Eliminar"><i class="bi bi-trash"></i></button>
              </div>
            </div>

            <button v-if="gallery.length < 9" @click="gallery.push('')" class="slot-add">
              <i class="bi bi-plus-lg"></i>
              <span>Agregar imagen</span>
            </button>
          </div>
        </section>

        <!-- ===== TESTIMONIOS ===== -->
        <section class="settings-section">
          <h3 class="settings-title"><i class="bi bi-chat-quote"></i> Testimonios</h3>
          <p class="settings-hint">Reseñas de clientes que aparecen al final del Home.</p>

          <div class="testimonials-list">
            <div v-for="(t, idx) in testimonials" :key="'t-' + idx" class="testimonial-card">
              <div class="testimonial-avatar">
                <img v-if="t.img" :src="t.img" :alt="t.name" class="avatar-img" />
                <div v-else class="avatar-placeholder"><i class="bi bi-person-fill"></i></div>
                <label class="btn-upload-small" :class="{ uploading: uploadingTestimonial[idx] }">
                  <i :class="uploadingTestimonial[idx] ? 'bi bi-arrow-repeat spin' : 'bi bi-camera'"></i>
                  <input type="file" accept="image/*" class="hidden-file" @change="e => uploadTestimonialImg(e, idx)" :disabled="uploadingTestimonial[idx]" />
                </label>
              </div>
              <div class="testimonial-fields">
                <input v-model="t.name" type="text" placeholder="Nombre del cliente" class="t-input" />
                <input v-model="t.img" type="text" placeholder="URL de foto (opcional)" class="t-input url-field" />
                <textarea v-model="t.text" placeholder="Reseña del cliente..." rows="2" class="t-textarea"></textarea>
              </div>
              <button @click="removeTestimonial(idx)" class="btn-remove" title="Eliminar"><i class="bi bi-trash"></i></button>
            </div>
          </div>

          <button @click="addTestimonial" class="btn-add-testimonial">
            <i class="bi bi-plus-circle"></i> Agregar testimonio
          </button>
        </section>
      </template>
    </AdminLayout>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import axiosConfig from '@/config/AxiosConfig.js';
import { homeSettingsService } from '@/services/homeSettings.js';
import AdminLayout from '@/components/AdminLayout.vue';

const loading = ref(false);
const saving = ref(false);

const banners = ref(['', '', '']);
const gallery = ref(['', '', '']);
const testimonials = ref([{ name: '', text: '', img: '' }]);

const uploadingBanner = ref({});
const uploadingGallery = ref({});
const uploadingTestimonial = ref({});

onMounted(async () => {
  loading.value = true;
  try {
    const res = await homeSettingsService.getSettings();
    const data = res.data?.data || res.data || {};
    if (data.banners?.length) banners.value = data.banners;
    if (data.gallery?.length) gallery.value = data.gallery;
    if (data.testimonials?.length) testimonials.value = data.testimonials;
  } catch {
    // Si no hay config aún, usar defaults
  } finally {
    loading.value = false;
  }
});

async function uploadImage(file) {
  if (!file.type.startsWith('image/')) throw new Error('Archivo no es imagen');
  if (file.size > 5 * 1024 * 1024) throw new Error('Imagen supera 5 MB');

  const fd = new FormData();
  fd.append('file', file);
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
  const { data } = await axios.post('/api/images/upload', fd, {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
    headers: {
      'Content-Type': 'multipart/form-data',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const url = data?.data || data?.url || data;
  if (typeof url !== 'string' || !url.startsWith('http')) throw new Error('URL inválida del servidor');
  return url;
}

async function uploadBanner(e, idx) {
  const file = e.target.files?.[0];
  if (!file) return;
  uploadingBanner.value = { ...uploadingBanner.value, [idx]: true };
  try {
    banners.value[idx] = await uploadImage(file);
    axiosConfig.ToastSuccess('Imagen subida', 'Banner actualizado');
  } catch (err) {
    axiosConfig.ToastError('Error', err.message || 'No se pudo subir la imagen');
  } finally {
    uploadingBanner.value = { ...uploadingBanner.value, [idx]: false };
    e.target.value = '';
  }
}

async function uploadGallery(e, idx) {
  const file = e.target.files?.[0];
  if (!file) return;
  uploadingGallery.value = { ...uploadingGallery.value, [idx]: true };
  try {
    gallery.value[idx] = await uploadImage(file);
    axiosConfig.ToastSuccess('Imagen subida', 'Imagen de galería actualizada');
  } catch (err) {
    axiosConfig.ToastError('Error', err.message || 'No se pudo subir la imagen');
  } finally {
    uploadingGallery.value = { ...uploadingGallery.value, [idx]: false };
    e.target.value = '';
  }
}

async function uploadTestimonialImg(e, idx) {
  const file = e.target.files?.[0];
  if (!file) return;
  uploadingTestimonial.value = { ...uploadingTestimonial.value, [idx]: true };
  try {
    testimonials.value[idx].img = await uploadImage(file);
    axiosConfig.ToastSuccess('Imagen subida', 'Foto del cliente actualizada');
  } catch (err) {
    axiosConfig.ToastError('Error', err.message || 'No se pudo subir la imagen');
  } finally {
    uploadingTestimonial.value = { ...uploadingTestimonial.value, [idx]: false };
    e.target.value = '';
  }
}

function removeBanner(idx) { banners.value.splice(idx, 1); }
function removeGallery(idx) { gallery.value.splice(idx, 1); }
function removeTestimonial(idx) { testimonials.value.splice(idx, 1); }
function addTestimonial() { testimonials.value.push({ name: '', text: '', img: '' }); }

async function saveAll() {
  saving.value = true;
  try {
    await homeSettingsService.saveSettings({
      banners: banners.value.filter(Boolean),
      gallery: gallery.value.filter(Boolean),
      testimonials: testimonials.value.filter(t => t.name?.trim() || t.text?.trim()),
    });
    axiosConfig.ToastSuccess('Guardado', 'Configuración del Home actualizada');
  } catch {
    axiosConfig.ToastError('Error', 'No se pudo guardar la configuración');
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.settings-section {
  background: white;
  border-radius: 14px;
  padding: 1.5rem;
  border: 1px solid #f0e0e8;
  margin-bottom: 1.5rem;
}

.settings-title {
  font-size: 1rem;
  font-weight: 700;
  color: #860734;
  margin: 0 0 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.settings-hint {
  font-size: 0.82rem;
  color: #999;
  margin: 0 0 1.25rem;
}

/* Image grid */
.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.image-slot {
  border: 2px solid #e0d0e0;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.slot-preview {
  width: 100%;
  height: 130px;
  object-fit: cover;
}

.slot-empty {
  width: 100%;
  height: 130px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #faf7f4;
  color: #ccc;
  gap: 0.4rem;
  font-size: 0.8rem;
}

.slot-empty i { font-size: 2rem; }

.slot-actions {
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  background: #fff;
}

.btn-upload {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.4rem 0.6rem;
  background: #860734;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-upload:hover { background: #6d0529; }
.btn-upload.uploading { background: #aaa; cursor: not-allowed; }

.url-input {
  width: 100%;
  padding: 0.35rem 0.5rem;
  border: 1px solid #e0d0e0;
  border-radius: 6px;
  font-size: 0.75rem;
  outline: none;
  box-sizing: border-box;
}

.url-input:focus { border-color: #860734; }

.btn-remove {
  align-self: flex-end;
  background: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 6px;
  padding: 0.3rem 0.6rem;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background 0.15s;
}

.btn-remove:hover { background: #fecaca; }

.slot-add {
  border: 2px dashed #e0d0e0;
  border-radius: 10px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #aaa;
  cursor: pointer;
  background: none;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.slot-add:hover { border-color: #860734; color: #860734; }
.slot-add i { font-size: 1.5rem; }

/* Testimonials */
.testimonials-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.testimonial-card {
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 1rem;
  align-items: start;
  padding: 1rem;
  border: 1px solid #e0d0e0;
  border-radius: 10px;
  background: #faf7f4;
}

.testimonial-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
}

.avatar-img {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e0d0e0;
}

.avatar-placeholder {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
  font-size: 1.8rem;
}

.btn-upload-small {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem 0.5rem;
  background: #860734;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.75rem;
  transition: background 0.2s;
}

.btn-upload-small:hover { background: #6d0529; }
.btn-upload-small.uploading { background: #aaa; cursor: not-allowed; }

.testimonial-fields {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.t-input, .t-textarea {
  width: 100%;
  padding: 0.4rem 0.6rem;
  border: 1px solid #e0d0e0;
  border-radius: 6px;
  font-size: 0.875rem;
  font-family: inherit;
  outline: none;
  box-sizing: border-box;
}

.t-input:focus, .t-textarea:focus { border-color: #860734; }
.url-field { font-size: 0.75rem; color: #888; }
.t-textarea { resize: vertical; }

.btn-add-testimonial {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: none;
  border: 2px dashed #e0d0e0;
  border-radius: 8px;
  color: #888;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.btn-add-testimonial:hover { border-color: #860734; color: #860734; }

.hidden-file { display: none; }

.spin {
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>
