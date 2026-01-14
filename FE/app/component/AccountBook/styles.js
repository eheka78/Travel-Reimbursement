import { StyleSheet } from "react-native";
import { colors } from "../../constant/colors";

export const styles = StyleSheet.create({
	safe: {
		flex: 1,
		backgroundColor: "#F6F7FB",
	},

	addButton: {
		marginHorizontal: 20,
		marginTop: 16,
		marginBottom: 24,
		height: 52,
		borderRadius: 16,
		backgroundColor: colors.point2,
		justifyContent: "center",
		alignItems: "center",
		elevation: 6,
	},
	addButtonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "700",
	},

	summaryCard: {
		marginHorizontal: 20,
		padding: 16,
		borderRadius: 16,
		backgroundColor: "white",
		marginBottom: 24,
		gap: 10,
	},
	summaryRow: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	summaryLabel: {
		fontSize: 14,
		color: "#555",
	},
	summaryValue: {
		fontSize: 17,
		fontWeight: "800",
		color: colors.point2,
	},

	tableWrapper: {
		marginHorizontal: 20,
		borderRadius: 16,
		backgroundColor: "white",
		overflow: "hidden",
		marginBottom: 25,
	},
	tableHeader: {
		flexDirection: "row",
		paddingVertical: 12,
		backgroundColor: colors.back2,
	},
	tableRow: {
		flexDirection: "row",
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderColor: colors.border,
	},

	cell: {
		flex: 1,
		fontSize: 13,
	},
	cellRight: {
		flex: 1,
		textAlign: "right",
		paddingRight: 12,
		fontSize: 13,
	},
	nameCell: {
		flex: 1.4,
		paddingLeft: 12,
		fontWeight: "600",
	},

	balancePositive: {
		color: colors.positive,
		fontWeight: "700",
	},
	balanceNegative: {
		color: colors.negative,
		fontWeight: "700",
	},

	sectionTitle: {
		fontSize: 16,
		fontWeight: "700",
		marginHorizontal: 20,
		marginBottom: 12,
	},

	card: {
		marginHorizontal: 20,
		marginBottom: 12,
		padding: 16,
		borderRadius: 16,
		backgroundColor: "white",
		elevation: 3,
	},
	cardHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 6,
	},
	cardTitle: {
		flex: 1,
		fontSize: 15,
		fontWeight: "700",
		marginRight: 8,
	},
	cardAmount: {
		fontSize: 16,
		fontWeight: "800",
		color: colors.point2,
	},
	
	metaRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	cardMeta: {
		fontSize: 12,
		color: "#666",
	},
	dot: {
		marginHorizontal: 6,
		color: "#bbb",
		fontSize: 12,
	},


	shareBox: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 6,
		marginTop: 3,
	},
	shareChip: {
		backgroundColor: colors.back,
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 999,
	},
	shareChipText: {
		fontSize: 11,
		fontWeight: "600",
		color: colors.point,
	},

	fab: {
		position: "absolute",
		right: 20,
		bottom: 60,
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: colors.point,
		justifyContent: "center",
		alignItems: "center",
		elevation: 6,
	},
	fabText: {
		color: "white",
		fontSize: 25,
		fontWeight: "bold",
		marginBottom: 2,
	},

	dateHeader: {
		marginHorizontal: 20,
		marginTop: 14,
		marginBottom: 10,
		flexDirection: "row",
		alignItems: "center",
	},
	dateLine: {
		flex: 1,
		height: 1,
		backgroundColor: "#E2E5EC",
	},
	dateHeaderText: {
		marginHorizontal: 10,
		paddingHorizontal: 12,
		paddingVertical: 4,
		borderRadius: 999,
		backgroundColor: "#EDEFF5",
		fontSize: 12,
		fontWeight: "700",
		color: "#555",
	},

	dateFilterHeader: {
		marginHorizontal: 20,
		marginBottom: 10,
		paddingHorizontal: 14,
		paddingVertical: 12,
		borderRadius: 14,
		backgroundColor: "white",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		elevation: 2,
	},
	dateFilterHeaderText: {
		fontSize: 14,
		fontWeight: "700",
		color: "#333",
	},
	dateFilterArrow: {
		fontSize: 14,
		fontWeight: "800",
		color: colors.point,
	},
	dateFilterRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
		marginHorizontal: 20,
		marginTop: 10,
		marginBottom: 14,
	},
	dateFilterButton: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 999,
		backgroundColor: "#EDEFF5",
	},
	dateFilterActive: {
		backgroundColor: colors.point,
	},
	dateFilterText: {
		fontSize: 12,
		fontWeight: "700",
		color: "#555",
	},
	dateFilterTextActive: {
		color: "white",
	},
});
