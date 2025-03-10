const db = require('../config/db');

const getTotalAmountFromSales = async () => {
    await db.query(`CALL GetTotalSalesInfo(@TotalSalesAmount, @StartDate, @EndDate);`);
    const [rows] = await db.query(`SELECT @TotalSalesAmount as TotalAmount, 
        @StartDate as StartDate, @EndDate as EndDate;`);
    return rows[0];
}

const getTotalProducts = async () => {
    const [rows] = await db.query(`SELECT COUNT(*) as TotalProducts FROM product;`);
    return rows[0].TotalProducts;
}

const getTotalCustomers = async () => {
    const [rows] = await db.query(`SELECT COUNT(*) as TotalCustomers FROM customer;`);
    return rows[0].TotalCustomers;
}

const getTotalSales = async () => {
    const [rows] = await db.query(`SELECT COUNT(*) as TotalSales FROM sales;`);
    return rows[0].TotalSales;
}

const getMonthlyTotalSales = async () => {
    const [rows] = await db.query(`SELECT 
    YEAR(Sales_Date) AS Sales_Year,
    MONTH(Sales_Date) AS Sales_Month,
    COUNT(Sales_ID) AS Total_Sales
    FROM sales
    GROUP BY Sales_Year, Sales_Month
    ORDER BY Sales_Year, Sales_Month;`);
    return rows;
}

const getWeeklyTotalSales = async () => {
    const [rows] = await db.query(`SELECT 
        YEAR(Sales_Date) AS Sales_Year, 
        WEEK(Sales_Date, 1) AS Sales_Week, 
        COUNT(Sales_ID) AS Total_Sales 
        FROM sales 
        GROUP BY Sales_Year, Sales_Week 
        ORDER BY Sales_Year, Sales_Week;`);
    return rows;
}

const getYearlyTotalSales = async () => {
    const [rows] = await db.query(`SELECT 
    YEAR(Sales_Date) AS Sales_Year,
    COUNT(Sales_ID) AS Total_Sales
    FROM sales
    GROUP BY Sales_Year
    ORDER BY Sales_Year;`);
    return rows;
}
module.exports = { getTotalAmountFromSales, getTotalProducts, getTotalCustomers, getTotalSales, getMonthlyTotalSales, getWeeklyTotalSales, getYearlyTotalSales };