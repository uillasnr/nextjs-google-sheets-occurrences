import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { Occurrence } from "@/types/occurrence";

/* ================= FONTES ================= */
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
      fontWeight: 400,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: 700,
    },
  ],
});

/* ================= HELPERS ================= */
const formatDate = (date?: string) => {
  if (!date) return "-";

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) return date;

  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return "-";

  return parsed.toLocaleDateString("pt-BR");
};

const statusStyle = (status?: string) => {
  if (status === "Pendente") return styles.statusPendente;
  if (status === "Em Andamento") return styles.statusAndamento;
  if (status === "Em analise") return styles.statusAnalise;
  return styles.statusDefault;
};

/* 🔥 CORREÇÃO DEFINITIVA DO ERRO */
const getRowStyle = (index: number) => {
  return index % 2 === 1
    ? [styles.row, styles.rowAlt]
    : [styles.row];
};

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  page: {
    padding: 14,
    fontFamily: "Roboto",
    backgroundColor: "#ffffff",
  },

  /* ---- CABEÇALHO ---- */
  header: {
    marginBottom: 8,
  },

  /* ---- TABELA ---- */
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1e40af",
    paddingVertical: 4,
    paddingHorizontal: 3,
  },
  headerCell: {
    fontSize: 6.5,
    fontWeight: 700,
    color: "#ffffff",
    textAlign: "center",
  },

  row: {
    flexDirection: "row",
    paddingVertical: 3,
    paddingHorizontal: 3,
    borderBottom: "1 solid #e2e8f0",
  },
  rowAlt: {
    backgroundColor: "#f8fafc",
  },
  cell: {
    fontSize: 6.5,
    color: "#1e293b",
    textAlign: "center",
    paddingHorizontal: 2,
  },

  /* ---- STATUS ---- */
  statusBadge: {
    fontSize: 6,
    fontWeight: 700,
    paddingVertical: 1,
    paddingHorizontal: 3,
    borderRadius: 3,
  },
  statusPendente: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
  },
  statusAndamento: {
    backgroundColor: "#dbeafe",
    color: "#1e40af",
  },
  statusAnalise: {
    backgroundColor: "#ede9fe",
    color: "#5b21b6",
  },
  statusDefault: {
    backgroundColor: "#e5e7eb",
    color: "#374151",
  },

  /* ---- FOOTER ---- */
  footer: {
    position: "absolute",
    bottom: 10,
    left: 14,
    right: 14,
    borderTop: "1 solid #e2e8f0",
    paddingTop: 3,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 6.5,
    color: "#64748b",
  },
});

/* ================= COMPONENT ================= */
interface Props {
  occurrences: Occurrence[];
  sheet: "SP" | "PE" | "ES";
}

const OccurrencePDFDocument: React.FC<Props> = ({
  occurrences,
  sheet,
}) => {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>

        {/* ===== CABEÇALHO MODERNO ===== */}
        <View style={styles.header}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#1e40af",
              letterSpacing: 0.5,
            }}
          >
            RELATÓRIO DE OCORRÊNCIAS
          </Text>

          <Text
            style={{
              fontSize: 8.5,
              color: "#64748b",
              marginTop: 2,
            }}
          >
            Pendente • Em Andamento 
          </Text>

          <View
            style={{
              height: 1,
              backgroundColor: "#e5e7eb",
              marginVertical: 6,
            }}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              fontSize: 7.5,
              color: "#1e293b",
            }}
          >
            <Text>Filial: {sheet}</Text>
            <Text>Total de ocorrências: {occurrences.length}</Text>
            <Text>Gerado em: {new Date().toLocaleString("pt-BR")}</Text>
          </View>
        </View>

        {/* ===== HEADER DA TABELA ===== */}
        <View style={styles.tableHeader}>
          {[
            "NF",
            "Cliente",
            "Transport.",
            "Dt Nota",
            "Dt Ocor.",
            "Solic.",
            "Ocorrência",
            "Observação",
            "Status",
          ].map((h) => (
            <Text
              key={h}
              style={[
                styles.headerCell,
                { flex: h === "Ocorrência" || h === "Observação" ? 2 : 1 },
              ]}
            >
              {h}
            </Text>
          ))}
        </View>

        {/* ===== LINHAS ===== */}
        {occurrences.map((occ, i) => (
          <View key={occ.id || i} style={getRowStyle(i)}>
            <Text style={[styles.cell, { flex: 1 }]}>{occ.nota}</Text>
            <Text style={[styles.cell, { flex: 1 }]}>{(occ.cliente || "").slice(0, 18)}</Text>
            <Text style={[styles.cell, { flex: 1 }]}>{(occ.transportadora || "").slice(0, 18)}</Text>
            <Text style={[styles.cell, { flex: 1 }]}>{formatDate(occ.dataNota)}</Text>
            <Text style={[styles.cell, { flex: 1 }]}>{formatDate(occ.dataOcorrencia)}</Text>
            <Text style={[styles.cell, { flex: 1 }]}>{(occ.solicitante || "").slice(0, 14)}</Text>
            <Text style={[styles.cell, { flex: 2 }]}>{(occ.ocorrencia || "").slice(0, 70)}</Text>
            <Text style={[styles.cell, { flex: 2 }]}>{(occ.obs || "").slice(0, 70)}</Text>

            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={[styles.statusBadge, statusStyle(occ.status)]}>
                {occ.status}
              </Text>
            </View>
          </View>
        ))}

        {/* ===== FOOTER ===== */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Filial {sheet}</Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) =>
              `Página ${pageNumber} de ${totalPages}`
            }
          />
        </View>

      </Page>
    </Document>
  );
};

export default OccurrencePDFDocument;
