export const nigeriaStateApiUrl = "https://nga-states-lga.onrender.com";
// Test Base URL

// export const baseUrl = `${window.location.protocol}//${window.location.hostname}:5000/api/v1`;

 export const baseUrl = `http://20.164.19.147:8085/api/v1`;


// export const baseUrl = `${window.location.protocol}//${window.location.hostname}/api/v1`;

const baseChecker = `${window.location.hostname}`;

export let FacilityName = "";

if (baseChecker === "adh.ehealthcareconnect.com") {
  FacilityName = "ASOKORO DISTRICT HOSPITAL (ADH)";
} else if (baseChecker === "ngh.ehealthcareconnect.com") {
  FacilityName = "NYANYA GENERAL HOSPITAL";
} else if (baseChecker === "kgh.ehealthcareconnect.com") {
  FacilityName = "Kuje General Hospital";
}else if (baseChecker === "krgh.ehealthcareconnect.com") {
  FacilityName = "Karu General Hospital";
}else if (baseChecker === "kwlgh.ehealthcareconnect.com") {
  FacilityName = "Kwali General Hospital";
}else if (baseChecker === "rbcgh.ehealthcareconnect.com") {
  FacilityName = "Rubochi General Hospital";
}else if (baseChecker === "rshgh.ehealthcareconnect.com") {
  FacilityName = "Karshi General Hospital";
} else if (baseChecker === "20.164.19.147") {
  FacilityName = "TEST HOSPITAL";
} else {
  FacilityName = "GENERAL HOSPITAL, ABUJA";
}

export const token = localStorage.getItem("token");
