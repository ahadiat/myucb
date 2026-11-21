

export interface StudentInformationData {
  name: string;
  matric: string;
  phone: string;
  email: string;
}

export const initialStudentInformation: StudentInformationData = {
  name: "",
  matric: "",
  phone: "",
  email: "",
};

export interface RegistrationData {
  student: StudentInformationData;
  invoiceNumber: string;
}
