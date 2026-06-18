async function saveProduct() {
  // Gather fields
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value;
  const stock = document.getElementById("stock").value;
  const imageInput = document.getElementById("imageFile");

  // Build FormData for file upload
  const formData = new FormData();
  formData.append("name", name);
  formData.append("price", price);
  formData.append("category", category);
  formData.append("description", description);
  formData.append("stock", stock);
  if (imageInput.files[0]) {
    formData.append("image", imageInput.files[0]);
  }

  try {
    const response = await fetch("http://localhost:5000/api/products", {
      method: "POST",
      body: formData
    });
    if (response.ok) {
      alert("Product Added Successfully");
      window.location = "products.html";
    } else {
      console.error("Failed to add product:", response.statusText);
      alert("Failed to Add Product");
    }
  } catch (error) {
    console.error(error);
    alert("Failed to Add Product");
  }
}
