import { showFormErrors } from "./showFormErrors.js";

export function validateAddForm() {
  // Validaciones específicas
  let isValid = true;

  // Validar título (máximo 100 caracteres)
  const title = document.getElementById('title').value.trim();
  if (title.length > 100) {
    showFormErrors('title', 'El título no puede exceder los 100 caracteres');
    isValid = false;
  }

  // Validar descripción corta (máximo 500 caracteres)
  let tagline = '';
  if (typeof CKEDITOR !== 'undefined' && CKEDITOR.instances.tagline) {
    tagline = CKEDITOR.instances.tagline
      .getData()
      .replace(/<[^>]*>/g, '')
      .trim();
  } else {
    tagline = document.getElementById('tagline').value.trim();
  }
  if (tagline.length > 500) {
    showFormErrors(
      'tagline',
      'El resumen corto no puede exceder los 500 caracteres'
    );
    isValid = false;
  }

  // Validar descripción larga (máximo 1000 caracteres)
  let overview = '';
  if (typeof CKEDITOR !== 'undefined' && CKEDITOR.instances.overview) {
    overview = CKEDITOR.instances.overview
      .getData()
      .replace(/<[^>]*>/g, '')
      .trim();
  } else {
    overview = document.getElementById('overview').value.trim();
  }
  if (overview.length > 1000) {
    showFormErrors(
      'overview',
      'La descripción no puede exceder los 1000 caracteres'
      );
    isValid = false;
  }

  // Validar imágenes (JPG y dimensiones)
  const coverInput = document.getElementById('cover');
  if (coverInput.files.length > 0) {
    const coverFile = coverInput.files[0];
    const validImageTypes = ['image/jpeg', 'image/jpg'];

    if (!validImageTypes.includes(coverFile.type)) {
      showFormErrors('cover', 'La imagen debe ser un archivo JPG');
      isValid = false;
    } else {
      // Verificar dimensiones
      const img = new Image();
      img.onload = function () {
        if (this.width !== 1024 || this.height !== 768) {
          showFormErrors(
            'cover',
            'La imagen debe tener dimensiones de 1024x768px'
          );
          isValid = false;
        }
      };
      img.src = URL.createObjectURL(coverFile);
    }
  }

  const tallCoverInput = document.getElementById('tall-cover');
  if (tallCoverInput.files.length > 0) {
    const tallCoverFile = tallCoverInput.files[0];
    const validImageTypes = ['image/jpeg', 'image/jpg'];

    if (!validImageTypes.includes(tallCoverFile.type)) {
      showFormErrors('cover', 'La imagen debe ser un archivo JPG');
      isValid = false;
    } else {
      // Verificar dimensiones
      const img = new Image();
      img.onload = function () {
        if (this.width !== 500 || this.height !== 750) {
          showFormErrors(
            'cover',
            'La imagen debe tener dimensiones de 500x750px'
          );
          isValid = false;
        }
      };
      img.src = URL.createObjectURL(tallCoverFile);
    }
  }

  // Validar trailer (MP4)
  const trailerInput = document.getElementById('trailer');
  if (trailerInput.files.length > 0) {
    const trailerFile = trailerInput.files[0];
    if (trailerFile.type !== 'video/mp4') {
      showFormErrors('trailer', 'El trailer debe ser un archivo MP4');
      isValid = false;
    }
  }

  // Validar archivos de contenido
  const type = document.getElementById('type').value;

  if (type === 'video/mp4') {
    const contentInput = document.getElementById('content');
    if (
      contentInput.files.length > 0 &&
      contentInput.files[0].type !== 'video/mp4'
    ) {
      showFormErrors('content', 'El contenido debe ser un archivo MP4');
      isValid = false;
    }
  } else if (type === 'application/vnd.apple.mpegurl') {
    // Validar archivo m3u8
    const m3u8Input = document.getElementById('m3u8');
    if (m3u8Input.files.length === 0) {
      showFormErrors('m3u8', 'Debes seleccionar un archivo .m3u8');
      isValid = false;
    } else if (!m3u8Input.files[0].name.endsWith('.m3u8')) {
      showFormErrors('m3u8', 'El archivo debe ser .m3u8');
      isValid = false;
    }

    // Validar archivos ts (deben ser ZIP)
    const tsInputs = ['ts1', 'ts2', 'ts3'];
    tsInputs.forEach((inputId) => {
      const input = document.getElementById(inputId);

      if (input.files.length === 0) {
        showFormErrors(inputId, 'Archivo obligatorio.');
        isValid = false;
      } else if (!input.files[0].name.endsWith('.zip')) {
        showFormErrors(inputId, 'El archivo debe ser .zip');
        isValid = false;
      }
    });
  }

  return isValid;
}
