import React, { useState, useEffect, Fragment } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

dayjs.extend(utc);

const styles = StyleSheet.create({
    page: {
        padding: 30,
    },
    header: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    section: {
        margin: 10,
        padding: 10,
    },
    title: {
        fontSize: 14,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    label: {
        width: 150,
        fontWeight: 'bold',
    },
    value: {
        flex: 1,
    },
    table: {
        display: 'table',
        width: 'auto',
        marginVertical: 10,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#000',
        minHeight: 25,
        textAlign: 'center',
    },
    tableHeader: {
        backgroundColor: '#f0f0f0',
    },
    tableCell: {
        flex: 1,
        padding: 5,
    },
});

function SettlementDocument({ employeeData, calculations }) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text>Final Settlement Statement</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.title}>Employee Information</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Name:</Text>
                        <Text style={styles.value}>{employeeData.fullName}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Employee ID:</Text>
                        <Text style={styles.value}>{employeeData.employeeId}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Department:</Text>
                        <Text style={styles.value}>{employeeData.department}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Termination Date:</Text>
                        <Text style={styles.value}>{employeeData.terminationDate}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.title}>Settlement Calculation</Text>
                    <View style={styles.table}>
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <Text style={styles.tableCell}>Component</Text>
                            <Text style={styles.tableCell}>Amount</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Basic Salary</Text>
                            <Text style={styles.tableCell}>${calculations.basicSalary.toFixed(2)}</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Accrued Leave</Text>
                            <Text style={styles.tableCell}>${calculations.accrualAmount.toFixed(2)}</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Benefits</Text>
                            <Text style={styles.tableCell}>${calculations.totalBenefits.toFixed(2)}</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Gratuity</Text>
                            <Text style={styles.tableCell}>${calculations.gratuityAmount.toFixed(2)}</Text>
                        </View>
                        <View style={[styles.tableRow, { fontWeight: 'bold' }]}>
                            <Text style={styles.tableCell}>Total Settlement</Text>
                            <Text style={styles.tableCell}>
                                ${(
                                    calculations.basicSalary +
                                    calculations.accrualAmount +
                                    calculations.totalBenefits +
                                    calculations.gratuityAmount
                                ).toFixed(2)}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.title}>Benefits Breakdown</Text>
                    {calculations.benefits.map((benefit, index) => (
                        <View key={index} style={styles.row}>
                            <Text style={styles.label}>{benefit.name}:</Text>
                            <Text style={styles.value}>${benefit.amount.toFixed(2)}</Text>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );

}


export default SettlementDocument;