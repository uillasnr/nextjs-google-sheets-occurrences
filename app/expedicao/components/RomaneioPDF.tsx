import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { Expedicao } from "@/types/Expedicao";
import { formatDateBR } from "@/lib/formatDate";

const styles = StyleSheet.create({
  page: {
    paddingTop: 32,
    paddingLeft: 32,
    paddingRight: 32,
    paddingBottom: 140, // espaço reservado para o rodapé fixo
    fontSize: 11,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    position: "relative",
  },

  /* ================= HEADER ================= */

  header: {
    marginBottom: 18,
    paddingBottom: 10,
    borderBottom: "2 solid #1f2937",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    letterSpacing: 1,
  },

  subtitle: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 4,
  },

  /* ================= INFO BOX ================= */

  infoBox: {
    marginTop: 12,
    marginBottom: 18,
    padding: 14,
    border: "1 solid #e5e7eb",
    borderRadius: 6,
    backgroundColor: "#f9fafb",
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  label: {
    fontWeight: "bold",
    color: "#374151",
  },

  value: {
    color: "#111827",
  },

  /* ================= TABELA ================= */

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1f2937",
    color: "#ffffff",
    paddingVertical: 6,
    paddingHorizontal: 6,
    fontWeight: "bold",
    borderRadius: 3,
  },

  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderBottom: "1 solid #e5e7eb",
  },

  colNota: { width: "30%" },
  colData: { width: "35%" },
  colVolumes: { width: "35%", textAlign: "right" },

  /* ================= RODAPÉ FIXO ================= */

  footer: {
    position: "absolute",
    bottom: 40,
    left: 32,
    right: 32,
    borderTop: "1 solid #d1d5db",
    paddingTop: 14,
  },

  totalBox: {
    marginBottom: 10,
    padding: 8,
    backgroundColor: "#eef2ff",
    borderRadius: 6,
    alignItems: "flex-end",
  },

  totalText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1e3a8a",
  },

  declaracao: {
    textAlign: "center",
    marginBottom: 24,
    fontSize: 10,
    color: "#374151",
  },

  assinaturaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  assinaturaBox: {
    width: "45%",
    alignItems: "center",
  },

  linhaAssinatura: {
    borderTop: "1 solid #111827",
    width: "100%",
    paddingTop: 8,
    alignItems: "center",
  },

  nomeAssinatura: {
    fontSize: 11,
    fontWeight: "bold",
  },

  labelAssinatura: {
    fontSize: 9,
    marginTop: 4,
    color: "#6b7280",
  },
});

type Props = {
  cliente: string;
  notas: Expedicao[];
  placaVeiculo: string;
  nomeMotorista: string;
  cpfMotorista: string;
  responsavelExpedicao: string;
};

export function RomaneioPDF({
  cliente,
  notas,
  placaVeiculo,
  nomeMotorista,
  cpfMotorista,
  responsavelExpedicao,
}: Props) {
  const totalVolumes = notas.reduce(
    (total, nf) => total + Number(nf.volumes || 0),
    0
  );

  const ITEMS_PER_PAGE = 18; // reduzido para não invadir o rodapé

  const pages = [];
  for (let i = 0; i < notas.length; i += ITEMS_PER_PAGE) {
    pages.push(notas.slice(i, i + ITEMS_PER_PAGE));
  }

  return (
    <Document>
      {pages.map((notasPagina, pageIndex) => {
        const isLastPage = pageIndex === pages.length - 1;

        return (
          <Page key={pageIndex} size="A4" style={styles.page}>
            {/* HEADER */}
            <View style={styles.header}>
              <Text style={styles.title}>ROMANEIO DE CARGA</Text>
              <Text style={styles.subtitle}>
                Documento de conferência e transporte de mercadorias
              </Text>
            </View>

            {/* INFO apenas na primeira página */}
            {pageIndex === 0 && (
              <View style={styles.infoBox}>
                <View style={styles.rowBetween}>
                  <Text>
                    <Text style={styles.label}>Cliente: </Text>
                    <Text style={styles.value}>{cliente}</Text>
                  </Text>
                  <Text>
                    <Text style={styles.label}>Data: </Text>
                    <Text style={styles.value}>
                       {new Date().toLocaleDateString("pt-BR")}
                    </Text>
                  </Text>
                </View>

                <View style={styles.rowBetween}>
                  <Text>
                    <Text style={styles.label}>Placa: </Text>
                    <Text style={styles.value}>{placaVeiculo}</Text>
                  </Text>
                  <Text>
                    <Text style={styles.label}>Motorista: </Text>
                    <Text style={styles.value}>{nomeMotorista}</Text>
                  </Text>
                </View>

                <View style={styles.rowBetween}>
                  <Text>
                    <Text style={styles.label}>CPF: </Text>
                    <Text style={styles.value}>{cpfMotorista}</Text>
                  </Text>
                  <Text>
                    <Text style={styles.label}>Total NFs: </Text>
                    <Text style={styles.value}>{notas.length}</Text>
                  </Text>
                </View>
              </View>
            )}

            {/* TABELA */}
            <View style={styles.tableHeader}>
              <Text style={styles.colNota}>Nota Fiscal</Text>
              <Text style={styles.colData}>Data</Text>
              <Text style={styles.colVolumes}>Volumes</Text>
            </View>

            {notasPagina.map((nf) => (
              <View key={nf.id} style={styles.tableRow}>
                <Text style={styles.colNota}>{nf.nota}</Text>
                <Text style={styles.colData}>
                  {formatDateBR(nf.dataNota)}
                </Text>
                <Text style={styles.colVolumes}>{nf.volumes}</Text>
              </View>
            ))}

            {/* RODAPÉ FIXO apenas na última página */}
            {isLastPage && (
              <View style={styles.footer}>
                <View style={styles.totalBox}>
                  <Text style={styles.totalText}>
                    Total de Volumes: {totalVolumes}
                  </Text>
                </View>

                <Text style={styles.declaracao}>
                  Declaro para os devidos fins que recebi e conferi as
                  mercadorias acima descritas, estando as mesmas em perfeitas
                  condições e em conformidade com as Notas Fiscais listadas.
                </Text>

                <View style={styles.assinaturaContainer}>
                  <View style={styles.assinaturaBox}>
                    <View style={styles.linhaAssinatura}>
                      <Text style={styles.nomeAssinatura}>
                        {nomeMotorista}
                      </Text>
                    </View>
                    <Text style={styles.labelAssinatura}>
                      Assinatura do Motorista
                    </Text>
                  </View>

                  <View style={styles.assinaturaBox}>
                    <View style={styles.linhaAssinatura}>
                      <Text style={styles.nomeAssinatura}>
                        {responsavelExpedicao}
                      </Text>
                    </View>
                    <Text style={styles.labelAssinatura}>
                      Assinatura do Responsável
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </Page>
        );
      })}
    </Document>
  );
}
