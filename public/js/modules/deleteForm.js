export function deleteForm(token, formClass, endpoint, message) {
  document.querySelectorAll(formClass).forEach((form) => {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const contentId = this.dataset.id;

      if (confirm('¿Estás seguro de eliminar este contenido?')) {
        try {
          const submitBtn = this.querySelector('[type="submit"]');
          submitBtn.disabled = true;

          const deleteResponse = await fetch(endpoint, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content_id: contentId }),
          });

          const deleteData = await deleteResponse.json();

          if (deleteData.success) {
            const row = form.closest('tr');
            if (row) {
              row.remove();
            }
            message.style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });

            setTimeout(() => {
              message.style.display = 'none';
            }, 5000);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    });
  });
}
