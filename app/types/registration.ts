

export interface StudentInformationData {
  name: string;
  matric: string;
  phone: string;
  email: string;
  password: string;
}

export const initialStudentInformation: StudentInformationData = {
  name: "",
  matric: "",
  phone: "",
  email: "",
  password: "",
};

export interface RegistrationData {
  student: StudentInformationData;
  invoiceNumber: string;
}
