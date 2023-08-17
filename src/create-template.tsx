import React from "react";
import ReactPDF, {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

type Medication = {
  name: string;
  dosage: {
    morning: { beforeMeal: boolean; afterMeal: boolean };
    afternoon: { beforeMeal: boolean; afterMeal: boolean };
    night: { beforeMeal: boolean; afterMeal: boolean };
  };
};

type Prescription = {
  medications: Medication[];
  advice: string;
};

type MedicalCaseData = {
  patient: {
    name: string;
    email: string;
    phone: string;
  };
  doctor: {
    name: string;
    email: string;
    phone: string;
  };
  diagnosis: string[];
  vitals: {
    height: number;
    weight: number;
    pulse: number;
    temperature: number;
    bloodPressure: string;
  };
  complaints: {
    description: string;
    duration: number;
    severity: string;
    frequency: string;
  }[];
  prescription: Prescription;
  completedAt: string;
};

interface PDFProps {
  data: MedicalCaseData;
}

const logoPlaceholder = "./Logo.png"; // Replace with actual logo URL

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  logo: {
    width: 147.22,
    height: 25,
    marginBottom: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 600,
    color: "#131925",
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  subheading: {
    fontSize: 16,
    fontWeight: 500,
    color: "#131925",
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    color: "#212935",
    lineHeight: 1.67,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#999999",
    margin: "16px 0",
  },
});

const PDF = ({ data }: PDFProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image src={logoPlaceholder} style={styles.logo} />
        <Text style={styles.heading}>Medical Case Report</Text>
        <View style={styles.section}>
          <Text style={styles.subheading}>Patient Information</Text>
          <Text style={styles.text}>Name: {data.patient.name}</Text>
          <Text style={styles.text}>Email: {data.patient.email}</Text>
          <Text style={styles.text}>Phone: {data.patient.phone}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.subheading}>Doctor Information</Text>
          <Text style={styles.text}>Name: {data.doctor.name}</Text>
          <Text style={styles.text}>Email: {data.doctor.email}</Text>
          <Text style={styles.text}>Phone: {data.doctor.phone}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.subheading}>Complaints</Text>
          {data.complaints.map((complaint, index) => (
            <Text key={index} style={styles.text}>
              {`${index + 1}. ${complaint.description}, Duration: ${
                complaint.duration
              } days, Severity: ${complaint.severity}, Frequency: ${
                complaint.frequency
              }`}
            </Text>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.subheading}>Diagnosis</Text>
          {data.diagnosis.map((item, index) => (
            <Text key={index} style={styles.text}>
              {`${index + 1}. ${item}`}
            </Text>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.subheading}>Prescription</Text>
          <Text style={styles.text}>Medications:</Text>
          {data.prescription.medications.map((medication, index) => (
            <Text key={index} style={styles.text}>
              {`${index + 1}. ${medication.name}`}
            </Text>
          ))}
          <Text style={styles.text}>Advice: {data.prescription.advice}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default async (data: MedicalCaseData) => {
  return await ReactPDF.renderToStream(<PDF {...{ data }} />);
};
