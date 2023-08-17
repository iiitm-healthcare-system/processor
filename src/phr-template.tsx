import React from "react";
import ReactPDF, {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";

type Medication = {
  name: string;
  dosage: {
    morning: { beforeMeal: boolean; afterMeal: boolean };
    afternoon: { beforeMeal: boolean; afterMeal: boolean };
    night: { beforeMeal: boolean; afterMeal: boolean };
  };
  quantity: number;
  notes: string;
  type: "dosage" | "notes";
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
  createdAt: string;
};

interface PDFProps {
  data: MedicalCaseData;
}

export function getTitleCase(str?: string) {
  if (!str) {
    return "";
  }
  return str.toLowerCase().replace(/\b(\w)/g, (s) => s.toUpperCase());
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
    fontSize: 18,
    fontWeight: 800,
    color: "#131925",
    marginBottom: 8,
  },
  section: {
    marginBottom: 8,
  },
  subheading: {
    fontSize: 15,
    fontWeight: 500,
    color: "#131925",
    marginBottom: 8,
  },
  text: {
    fontSize: 12,
    color: "#212935",
    lineHeight: 1.35,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#999999",
    margin: "16px 0",
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderRadius: 5,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    alignContent: "flex-start",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 5,
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
    textAlign: "left",
    width: "100%",
  },
  borederdSection: {
    borderStyle: "solid",
    borderWidth: 1,
    padding: 8,
    paddingBottom: 3,
    width: "auto",
    borderRadius: 5,
  },
});

const PDF = ({ data }: PDFProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image src={logoPlaceholder} style={styles.logo} />
        <Text style={styles.heading}>Medical Case Report</Text>
        <Text style={{ ...styles.text, color: "#999999" }}>
          Date: {new Date().toDateString()}
        </Text>
        <Text style={{ ...styles.text, color: "#999999", marginBottom: 15 }}>
          Time: {new Date().toLocaleTimeString()}
        </Text>
        <View style={styles.section}>
          <Text style={styles.subheading}>Patient Information</Text>
          <View style={{ ...styles.section, ...styles.borederdSection }}>
            <Text style={styles.text}>
              Name: {getTitleCase(data.patient.name)}
            </Text>
            <Text style={styles.text}>Email: {data.patient.email}</Text>
            <Text style={styles.text}>Phone: {data.patient.phone}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.subheading}>Doctor Information</Text>
          <View style={{ ...styles.section, ...styles.borederdSection }}>
            <Text style={styles.text}>
              Name: {getTitleCase(data.doctor.name)}
            </Text>
            <Text style={styles.text}>Email: {data.doctor.email}</Text>
            <Text style={styles.text}>Phone: {data.doctor.phone}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.subheading}>Complaints</Text>
          <View style={{ ...styles.section, ...styles.borederdSection }}>
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
        </View>
        <View style={styles.section}>
          <Text style={styles.subheading}>Diagnosis</Text>
          <View style={{ ...styles.section, ...styles.borederdSection }}>
            {data.diagnosis.map((item, index) => (
              <Text key={index} style={styles.text}>
                {`${index + 1}. ${item}`}
              </Text>
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.subheading}>Prescription</Text>
          <Text style={{ ...styles.text, marginBottom: 5 }}>Medications:</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={{ ...styles.tableCol, width: "40%" }}>
                <Text style={styles.tableCell}>Name</Text>
              </View>
              <View style={{ ...styles.tableCol, width: "15%" }}>
                <Text style={styles.tableCell}>Quantity</Text>
              </View>
              <View style={{ ...styles.tableCol, width: "45%" }}>
                <Text style={styles.tableCell}>Dosage</Text>
              </View>
            </View>
            {data.prescription.medications.map((medication, index) => (
              <View style={styles.tableRow} key={index}>
                <View style={{ ...styles.tableCol, width: "40%" }}>
                  <Text style={styles.tableCell}>
                    {getTitleCase(medication.name)}
                  </Text>
                </View>
                <View style={{ ...styles.tableCol, width: "15%" }}>
                  <Text style={styles.tableCell}>{medication.quantity}</Text>
                </View>
                <View style={{ ...styles.tableCol, width: "45%" }}>
                  <Text style={styles.tableCell}>
                    {medication.type == "notes"
                      ? medication.notes
                      : `Morning: ${
                          medication.dosage.morning.beforeMeal
                            ? "Before Meal"
                            : medication.dosage.morning.afterMeal
                            ? "After Meal"
                            : "-"
                        }
                  Afternoon: ${
                    medication.dosage.afternoon.beforeMeal
                      ? "Before Meal"
                      : medication.dosage.afternoon.afterMeal
                      ? "After Meal"
                      : "-"
                  }
                  Night: ${
                    medication.dosage.night.beforeMeal
                      ? "Before Meal"
                      : medication.dosage.night.afterMeal
                      ? "After Meal"
                      : "-"
                  }`}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <Text style={{ ...styles.text, marginTop: 10 }}>
            Advice: {data.prescription.advice}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default async (data: MedicalCaseData) => {
  return await ReactPDF.renderToStream(<PDF {...{ data }} />);
};
