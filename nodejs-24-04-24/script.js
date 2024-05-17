async function fetchApartments() {
    const selectedCity = document.querySelector('input[name="city"]:checked').value;
    const response = await fetch(`http://localhost:3000/apartments?city=${selectedCity}`);
    const data = await response.json();
  
    const apartmentsDiv = document.getElementById("apartments");
    apartmentsDiv.innerHTML = "";
  
    data.forEach((apartment) => {
      const apartmentInfo = document.createElement("pre");
      apartmentInfo.textContent = `${apartment.name} - Price:  ₼${apartment.price}`;
      apartmentsDiv.appendChild(apartmentInfo);
    });
}
  