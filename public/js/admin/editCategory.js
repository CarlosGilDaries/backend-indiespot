async function editCategoryForm() {
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("auth_token");
    const backendAPI = "https://indiespot.test/api/";
    const select = document.getElementById("edit-category-priority");

    loadCategoryData(id);

    async function loadCategoryData(id) {
        try {
            const priorityResponse = await fetch(backendAPI + "categories", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const priorityData = await priorityResponse.json();
            const priorities = priorityData.priorities;

            priorities.forEach((priority) => {
                const option = document.createElement("option");
                option.innerHTML = priority;
                option.value = priority;
                select.appendChild(option);
            });

            const response = await fetch(`${backendAPI}category/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await response.json();

            if (data.success && data.category) {
                document.getElementById("edit-category-name").value =
                    data.category.name;
                document.getElementById("edit-category-priority").value =
                    data.category.priority;
                if (data.category.render_at_index == 1) {
                    document.getElementById(
                        "edit-category-render"
                    ).checked = true;
                }
            } else {
                console.error("Error:", data.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    // Manejar el envío del formulario
    document
        .getElementById("edit-category-form")
        .addEventListener("submit", async function (e) {
            e.preventDefault();

            const id = localStorage.getItem("id");

            document.getElementById("edit-category-loading").style.display =
                "block";

            try {
                const formData = new FormData();
                formData.append(
                    "name",
                    document.getElementById("edit-category-name").value
                );
                formData.append(
                    "priority",
                    document.getElementById("edit-category-priority").value
                );
                if (document.getElementById("edit-category-render").checked) {
                    formData.append(
                        "render_at_index",
                        document.getElementById("edit-category-render").value
                    );
                } else {
                    formData.append("render_at_index", 0);
                }

                const response = await fetch(
                    `${backendAPI}edit-category/${id}`,
                    {
                        method: "POST",
                        headers: { Authorization: `Bearer ${token}` },
                        body: formData,
                    }
                );

                const data = await response.json();

                if (data.success) {
                    document.getElementById(
                        "edit-category-success-message"
                    ).style.display = "block";
                    setTimeout(() => {
                        document.getElementById(
                            "edit-category-success-message"
                        ).style.display = "none";
                    }, 5000);
                }
            } catch (error) {
                console.error("Error submitting form:", error);
            } finally {
                document.getElementById("edit-category-loading").style.display =
                    "none";
            }
        });
}

editCategoryForm();

