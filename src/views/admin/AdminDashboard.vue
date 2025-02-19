<script setup lang="ts">
const options = {
        chart: {
          foreColor: '#FFFFFF',
          toolbar:{
            show:false
          }
        },
        xaxis: {
          labels:{
            show: true,
            style:{
            fontFamily: 'Roboto',
            fontWeight:'500'
            }
          },
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]        },
        theme: {
          palette: 'palette5'
        },
        yaxis: {
          labels:{
            show: true,
            style:{
            fontFamily: 'Roboto',
            fontWeight:'500'
            }
          }
        },
        dataLabels: {
          style: {
            fontFamily: 'Roboto',
            fontSize: '13px',
            fontWeight:'500',
            fill: '#ffffff'
          }
        },
        tooltip: {
          enabled:false
        }
      }

const series= [{
        name: 'series-1',
        data: [30, 40, 45, 50, 49, 60, 70, 91],
      }]
</script>

<template>
    <main class="dashboard-container">
        <div class="dashboard-1">
          <div class="dashboard-1-1 widget">
            <div>Total Earnings</div>
            <div>PHP 120,000.00</div>
          </div>
          <div class="dashboard-1-2 widget">
            <div>Number of Sales</div>
            <div>12</div>
          </div>
          <div class="dashboard-1-3 widget">
            <div>Total Products</div>
            <div>12</div>
          </div>
          <div class="dashboard-1-4 widget">
            <div>Low Stock</div>
            <div>12</div>
          </div>
          <div class="dashboard-1-5 widget">
            <div>Customers</div>
            <div>500 Customers</div>
          </div>
        </div>
        <div class="dashboard-2">
          <div class="dashboard-2-1 widget">
            <div class="dashboard-wHead">
              <div>
                Sales Trends
              </div>
              <select class="d-select" id="sales-range">
                <option value="month">1 Month</option>
                <option value="threeMonth">3 Months</option>
                <option value="sixMonth">6 Months</option>
                <option value="year">1 Year</option>
              </select>
            </div>
            <apexchart 
            type="bar" 
            width="100%"
            height="200px"
            :options="options" 
            :series="series"/>
          </div>
        </div>
        <div class="dashboard-3">
          <div class="dashboard-3-1 widget">
            <div class="dashboard-wHead">
              <div>
                Inventory & Stock
              </div>
              <select class="d-select" id="sort-product">
                <option value="month">1 Month</option>
                <option value="threeMonth">3 Months</option>
                <option value="sixMonth">6 Months</option>
                <option value="year">1 Year</option>
              </select>
            </div>
                <table class="products-table d-table">
                    <thead>
                      <tr>
                        <td>Product</td>
                        <td>Stocks</td>
                        <td>Expiry Date</td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Bear Brand 10x250mg</td>
                        <td>
                          <div class="tooltip-item">1
                            <div class="tooltip">Test</div>
                          </div>
                        </td>
                        <td>
                          <div class="tooltip-item">1
                            <div class="tooltip">Test</div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>Bear Brand 10x250mg</td>
                        <td>
                          <div class="tooltip-item">1
                            <div class="tooltip">Test</div>
                          </div>
                        </td>
                        <td>
                          <div class="tooltip-item">1
                            <div class="tooltip">Test</div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                </table>
            </div>

          <div class="dashboard-3-2 widget">
            <div class="dashboard-wHead">
              <div>
                Recent Orders
              </div>
              <select class="d-select" id="sort-orders">
                <option value="month">1 Month</option>
                <option value="threeMonth">3 Months</option>
                <option value="sixMonth">6 Months</option>
                <option value="year">1 Year</option>
              </select>
            </div>
            <table class="orders-table d-table">
              <thead>
                  <tr>
                    <td>Order #</td>
                    <td>Customer</td>
                    <td>Products</td>
                    <td>Transaction Date</td>
                    <td>Total Amount</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>123</td>
                    <td>Michael Jackson</td>
                    <td>
                      <div class="tooltip-item">100 Products
                          <div class="tooltip">Test</div>
                        </div>
                    </td>
                    <td>July 19, 2022</td>
                    <td>PHP 100,000.00</td>
                  </tr>
                  <tr>
                    <td>123</td>
                    <td>Michael Jackson</td>
                    <td>
                      <div class="tooltip-item">
                          100 Products
                          <div class="tooltip">Test</div>
                        </div>
                    </td>
                    <td>July 19, 2022</td>
                    <td>PHP 100,000.00</td>
                  </tr>
                </tbody>
            </table>
          </div>
        </div>
    </main>
</template>

<style scoped>

  .text{
    text-wrap:wrap;
    overflow: auto;
  }

  .tooltip-item{
    height:max-content;
    position: relative;
    flex-direction: column;
    width: min-content;
  }
  .tooltip-item .tooltip {
    border-radius:5px;
    margin-left:-10px;
    margin-top:2px;
    padding:5px;
    background-color: rgb(31, 25, 25);
    visibility: hidden;
    position: absolute;
    width:120px;
    z-index: 1;
  }

  .tooltip-item:hover {
    text-decoration: dashed underline 1px;
    text-underline-offset: 2px;
  }

  .tooltip-item:hover .tooltip {
    visibility: visible;
  }


  .d-table{
    border-collapse: collapse;
    width:100%;
  }

  .d-table thead td {
    padding: 14px 14px 12px 14px;
    font-weight: 600;
  }
  

  .d-table tbody td {
    font-size:15px;
    padding: 12px 0 12px 14px;
    border-top: 1px solid black;
    font-variation-settings:
    "wdth" 75;
  }

  .dashboard-container {
    display: flex;
    text-wrap:nowrap;
    flex-direction: column;
    gap:28px;
    padding: 29px;
  }

  .widget{
    flex: 1 1;
    color: #FFF;
    border-radius: 13px;
    background-color: #967D7D;
    padding:20px;
    height:max-content;

  }
  .dashboard-container > div{
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap:28px;

  }

  .dashboard-2-1, .dashboard-3-1, .dashboard-3-2{
    padding:20px;
    height:max-content;
  }

  .dashboard-wHead{
    display: flex;
    margin-bottom:5px;
    align-items: center;
    justify-content: space-between;
    width:100%;
  }

  .dashboard-1 > .widget > div:nth-of-type(1){
    font-size: 14px;
    font-weight: 300;
  }

  .dashboard-1 > .widget > div:nth-of-type(2){
    font-size: 24px;
    font-style: italic;
    font-weight: 900;
  }

  .dashboard-2-1-1 >  div:nth-of-type(1){
    font-size: 16px;
    font-weight: 700;
  }

  .d-select{
    
    border: 1px solid rgb(65, 51, 51);
    background-color: transparent;
    border-radius:15px;
    color:white;
    padding:6px;
    font-family: Roboto;
    font-size: 13px;
    font-weight: 700;
  }

  .d-select:hover{

  }


</style>