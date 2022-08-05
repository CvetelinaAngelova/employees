import "./App.css";
import { useState } from "react";
import Papa from "papaparse";

function App() {

  const [tablehead, setTableTh] = useState([]);

  const [values, setValues] = useState([]);

  const [parsedData, setParsedData] = useState([]);

  const changeHandler = (event) => {
    // Uploading and parsing CSV 
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const rowsArray = [];
        const valuesArray = [];

		const objectsEqual = (o1, o2) => 
    typeof o1 === 'object' && Object.keys(o1).length > 0 
        ? Object.keys(o1).length === Object.keys(o2).length 
            && Object.keys(o1).every(p => objectsEqual(o1[p], o2[p]))
        : o1 === o2;

        var employes = [];
        let projectsEmployees;

        const
        oneDay  = 24 * 60 * 60 * 1000 
      , setDate = YMD =>
          {
          let [Y,M,D] = YMD.split('-').map(Number)
          return new Date(Y,--M,D)
          }

        results.data.map((item) => {
          rowsArray.push(Object.keys(item));
          valuesArray.push(Object.values(item));

          // grouping Employees by projectId , also changing date string to JS newDate to handle dates/null

          projectsEmployees = valuesArray.reduce( (item,[EmployeeID, ProjectID, DateFrom, DateTo])=>
          {
            let dateFrom = setDate(DateFrom)
                , dateTo = DateTo && !DateTo === "NULL" ? setDate(DateTo) :  new Date()
             item[ProjectID] = item[ProjectID] ?? []
             item[ProjectID].push({EmployeeID,dateFrom,dateTo})
              return item
          }, {})
        });

        // combination by pairs for employees per project 

let combination = {}
for (let proj in projectsEmployees) 
for (let i = 0; i < projectsEmployees[proj].length - 1; i++) 
for (let j = i + 1; j < projectsEmployees[proj].length; j++) 
  {
  let employeeA = projectsEmployees[proj][i]
  let employeeB = projectsEmployees[proj][j]

  if (( employeeA.dateTo <= employeeB.dateTo && employeeA.dateTo > employeeB.dateFrom )
    ||( employeeB.dateTo <= employeeA.dateTo && employeeB.dateTo > employeeA.dateFrom )
    ){
    let 
      D1   = employeeA.dateFrom > employeeB.dateFrom ? employeeA.dateFrom : employeeB.dateFrom
    , D2   = employeeA.dateTo < employeeB.dateTo ? employeeA.dateTo : employeeB.dateTo
    , days = Math.ceil((D2 - D1) / oneDay)
    , key  = `${employeeA.EmployeeID}-${employeeB.EmployeeID}`;

    combination[key] = combination[key] ?? { employeeA: employeeA.EmployeeID, employeeB: employeeB.EmployeeID, totalDays:0 }
    combination[key].totalDays += days
    }
  }   

  let Result  =  
  Object.entries(combination)
  .sort((a,b)=> b[1].totalDays - a[1].totalDays )
  .map(([k,v])=>v)



  Result.forEach(el => {
    JSON.stringify(el).replaceAll('"','')
    employes.push(Object.values(el));
  });
  var employesOutput = []

      employes.map((item) => {
        employesOutput.push(Object.values(item));
  });


        // Column titles
       setTableTh(rowsArray[0]);

        // Values INput
        setValues(valuesArray);

         // Values Output
         setParsedData(employesOutput);
      },
    });
  };



  return (
    <div>
      <input
        type="file"
        name="file"
        onChange={changeHandler}
        accept=".csv"
        style={{ display: "block", margin: "10px auto" }}
      />

     <p>Sample data:</p>  
      <table>
        <thead>
          <tr>
            {tablehead.map((rows, index) => {
              return <th key={index}>{rows}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {values.map((value, index) => {
            return (
              <tr key={index}>
                {value.map((val, i) => {
                  return <td key={i}>{val}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
     
      <br />

      <p>Sample output:</p> 
      <table>
        <thead>
          <tr>
         <td>EmployeeID1</td>
         <td>EmployeeID2</td>
         <td>DaysWorkingTogether</td>
          </tr>
        </thead>
        <tbody>
           {parsedData.map((value, index) => {
              return (
                <tr key={index}>
                  {value.map((val, i) => {
                    return <td key={i}>{val}</td>;
                  })}
                </tr>
              );
            })}  
        </tbody>
      </table>
    </div>
  );  
}

export default App;