import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { Expedicao } from "@/types/Expedicao";

const styles = StyleSheet.create({
  page: {
    padding: 28,
    fontSize: 12,
    fontFamily: "Helvetica",
  },

  header: {
    marginBottom: 16,
    borderBottom: "2 solid #111",
    paddingBottom: 8,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 12,
    color: "#555",
  },

  infoBox: {
    marginTop: 10,
    marginBottom: 14,
    padding: 10,
    border: "1 solid #ccc",
    borderRadius: 4,
    backgroundColor: "#f7f7f7",
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  tableHeader: {
    flexDirection: "row",
    borderBottom: "1 solid #000",
    paddingBottom: 4,
    marginBottom: 6,
    fontWeight: "bold",
  },

  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
    paddingBottom: 4,
    borderBottom: "1 solid #eee",
  },

  colNota: { width: "30%" },
  colData: { width: "35%" },
  colVolumes: { width: "35%", textAlign: "right" },

  totalBox: {
    marginTop: 12,
    alignItems: "flex-end",
  },

  totalText: {
    fontSize: 14,
    fontWeight: "bold",
  },

  footer: {
    marginTop: 40,
    borderTop: "1 solid #ccc",
    paddingTop: 16,
  },

  signatureLine: {
    marginTop: 30,
    borderTop: "1 solid #000",
    width: "60%",
    alignSelf: "center",
    textAlign: "center",
    paddingTop: 4,
  },
});

type Props = {
  cliente: string;
  notas: Expedicao[];
  placaVeiculo: string;
  nomeMotorista: string;
  cpfMotorista: string;
};

export function RomaneioPDF({
  cliente,
  notas,
  placaVeiculo,
  nomeMotorista,
  cpfMotorista,
}: Props) {
  const totalVolumes = notas.reduce(
    (total, nf) => total + Number(nf.volumes || 0),
    0
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>ROMANEIO DE CARGA</Text>
          <Text style={styles.subtitle}>
            Documento de conferência e transporte de mercadorias
          </Text>
        </View>

        {/* INFORMAÇÕES PRINCIPAIS */}
        <View style={styles.infoBox}>
          <View style={styles.rowBetween}>
            <Text><Text style={{ fontWeight: "bold" }}>Cliente:</Text> {cliente}</Text>
            <Text><Text style={{ fontWeight: "bold" }}>Data:</Text> {new Date().toLocaleDateString()}</Text>
          </View>

          <View style={styles.rowBetween}>
            <Text><Text style={{ fontWeight: "bold" }}>Placa do Veículo:</Text> {placaVeiculo}</Text>
            <Text><Text style={{ fontWeight: "bold" }}>Motorista:</Text> {nomeMotorista}</Text>
          </View>

          <View style={styles.rowBetween}>
            <Text><Text style={{ fontWeight: "bold" }}>CPF do Motorista:</Text> {cpfMotorista}</Text>
            <Text><Text style={{ fontWeight: "bold" }}>Total de NFs:</Text> {notas.length}</Text>
          </View>
        </View>

        {/* TABELA DE NOTAS */}
        <View style={styles.tableHeader}>
          <Text style={styles.colNota}>Nota Fiscal</Text>
          <Text style={styles.colData}>Data</Text>
          <Text style={styles.colVolumes}>Volumes</Text>
        </View>

        {notas.map((nf) => (
          <View key={nf.id} style={styles.tableRow}>
            <Text style={styles.colNota}>{nf.nota}</Text>
            <Text style={styles.colData}>{nf.dataNota}</Text>
            <Text style={styles.colVolumes}>{nf.volumes}</Text>
          </View>
        ))}

        {/* TOTAL */}
        <View style={styles.totalBox}>
          <Text style={styles.totalText}>Total de Volumes: {totalVolumes}</Text>
        </View>

        {/* ASSINATURA */}
        <View style={styles.footer}>
          <Text style={{ textAlign: "center", marginBottom: 20 }}>
            Declaro que recebi e conferi as mercadorias acima descritas.
          </Text>

          <Text style={styles.signatureLine}>
            Assinatura do Motorista
          </Text>
        </View>
      </Page>
    </Document>
  );
}
