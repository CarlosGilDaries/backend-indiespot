document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('register-form');
  const steps = document.querySelectorAll('.form-step');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const submitBtn = document.querySelector('.submit-btn');
  let currentStep = 0;

  // Inicializar pasos
  function showStep(step) {
    steps.forEach((s, index) => {
      s.classList.remove('active', 'next', 'prev');
      if (index === step) {
        s.classList.add('active');
      } else if (index > step) {
        s.classList.add('next');
      } else {
        s.classList.add('prev');
      }
    });

    // Actualizar botones de navegación
    prevBtn.disabled = step === 0;
    nextBtn.style.display = step === steps.length - 1 ? 'none' : 'block';
    submitBtn.style.display = step === steps.length - 1 ? 'block' : 'none';
  }

  // Siguiente paso
  nextBtn.addEventListener('click', function () {
    // Validar campos del paso actual antes de avanzar
    const currentFields = steps[currentStep].querySelectorAll(
      'input[required], select[required]'
    );
    let isValid = true;

    currentFields.forEach((field) => {
        if (field.id == 'portfolio' && field.value == "") {
          field.value = "No";
        }
      if (!field.value.trim()) {
        field.style.border = '2px solid red';
        isValid = false;
      } else {
        field.style.border= '';
      }
    });

    if (isValid) {
      if (currentStep < steps.length - 1) {
        currentStep++;
        showStep(currentStep);
      }
    } else {
        document.getElementById('error-message').textContent =
            'Por favor, rellena todos los campos';
        document.getElementById('error-message').style.display = 'block';
    }
  });

  // Paso anterior
  prevBtn.addEventListener('click', function () {
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep);
    }
  });

  // Quitar estilos de error al escribir
  steps.forEach((step) => {
    step.querySelectorAll('input, select').forEach((input) => {
      input.addEventListener('focus', function () {
          this.style.border = '';
          document.getElementById('error-message').textContent = "";
          document.getElementById('error-message').style.display = 'none';

      });
    });
  });

  // Inicializar
  showStep(0);
});
