

const onlineUser = JSON.parse(localStorage.getItem("onlineUser"))

// console.log

let role = onlineUser?.roleId;
let permissions = onlineUser?.permissions


export const isAuthenticated = () => {
    if (localStorage.getItem("token")) {
        return true;
    } else {
        return false;
    }
};

export const isActive = (history, path) => {
    let activeScreen = history.pathname === path ? true :  false
    return activeScreen;
}



export const isAdmin = () => {
   
    if (role === "Admin") {
        return true
    } else {
        return false
    }

};

export const isOutPatientParent = () => {
    let id = 1

    let result = permissions?.includes(id)

    if (result) {
        return true
    } else {
        return false
    }

};
export const isOutPatient = () => {
    let id = 2

    let result = permissions?.includes(id)

    if (result) {
        return true
    } else {
        return false
    }

};
export const isInPatient = () => {
    let id = 3

    let result = permissions?.includes(id)
    if (result) {
        return true
    } else {
        return false
    }

};
export const isLabStaff = () => {
    let id = 4

    let result = permissions?.includes(id)

    if (result) {
        return true
    } else {
        return false
    }

};
export const isRadiologyStaff = () => {
    let id = 5

    let result = permissions?.includes(id)

    if (result) {
        return true
    } else {
        return false
    }

};
export const isScheduleAppointmentStaff = () => {
    let id = 6

    let result = permissions?.includes(id)

    if (result) {
        return true
    } else {
        return false
    }

};
export const isScheduleProcedureStaff = () => {
   let id = 7

    let result = permissions?.includes(id)

    if (result) {
        return true
    } else {
        return false
    }

};
export const isPharmacyStaff = () => {
  let id = 8

    let result = permissions?.includes(id)

    if (result) {
        return true
    } else {
        return false
    }

};
export const isInventoryStaff = () => {
     let id = 14

    let result = permissions?.includes(id)


    if (result) {
        return true
    } else {
        return false
    }

}; 


export const isBillingStaff = () => {
     let id = 9

    let result = permissions?.includes(id)

    if (result) {
        return true
    } else {
        return false
    }

};
export const isBillingStaffHOD = () => {
    let id = 15

    let result = permissions?.includes(id)

    if (result) {
        return true
    } else {
        return false
    }

};
export const isRecordStaff = () => {
      let id = 10

    let result = permissions?.includes(id)


    if (result) {
        return true
    } else {
        return false
    }

};
export const isClinicalReport = () => {
     let id = 11

    let result = permissions?.includes(id)


    if (result) {
        return true
    } else {
        return false
    }

};
export const isUserManagerStaff = () => {
     let id = 12

    let result = permissions?.includes(id)

    if (result) {
        return true
    } else {
        return false
    }

};


export const isTheatreStaff = () => {
    let id = 13

    let result = permissions?.includes(id)

    if (result) {
        return true
    } else {
        return false
    }

};

