import React, { useState,useEffect} from 'react'
import { connect } from 'react-redux'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";      
import { postSchedule } from '../../redux';
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
// import { useAlert } from 'react-alert'
import Button from  'react-bootstrap/Button'
import Card from "react-bootstrap/Card"
import InputGroup from 'react-bootstrap/InputGroup'
import Alert from 'react-bootstrap/Alert'
import {AiOutlineClose} from 'react-icons/ai'

 const ScheduleForm=(props)=>{
    const [show, setShow] = useState(false)
    // const alert = useAlert()
    const [selectedService,setSelectedService] = useState("")
    const [charge,setCharge] = useState(0)
    const [companyserviceId, setCompanyserviceId]=useState()
    const [numOfPets, setNumOfPets]=useState(1)
    const [startDate, setStartDate]=useState( setHours(setMinutes(new Date(), 30), 7))
    const [endDate, setEndDate]=useState(setHours(setMinutes(new Date(), 30), 7))
    const [reserveBtn,setReserveBtn] = useState(true)
    const [totalCharge, setTotalCharge] = useState(0)
   const populateServices=(services)=> services.map((ser,index)=><option key={index} id={ser.id}>{ser.service + " $ " + ser.charge} </option>)
    
   const handelChangeService=(event)=>{
       const{services} = props.company
       let service =  event.target.value.split(" $ ")[0]
       let charge = parseInt(event.target.value.split(" $ ")[1].slice(0,2))
       let id = services.find(ser=>ser.service===service).companyservices_id
       setReserveBtn(false)
       setSelectedService(service)
       setCharge(charge)
       setCompanyserviceId(id)

    }
const updateTotalCharge=()=>{
    if(selectedService === "Walk dog"){
        let halfHrs = ((endDate.getDate()-startDate.getDate())*12+((endDate.getHours() +endDate.getMinutes()/60)-(startDate.getHours() +startDate.getMinutes()/60)))*2
        setTotalCharge( halfHrs * charge * numOfPets)
        }else{
            let days = (Math.floor((endDate.getTime() -startDate.getTime() )/ (1000 * 60 * 60 * 24)) + 1)
            setTotalCharge (charge * numOfPets *days)
        }

}
useEffect(updateTotalCharge,[selectedService,numOfPets,startDate,endDate])
  
const handleClick=()=>{

    
        props.addSchedule({
        user_id: props.user.id,
        companyservice_id:companyserviceId,
        num_of_pets:numOfPets,
        start_date:startDate,
        start_time:startDate.getHours()+ ":" +startDate.getMinutes(),
        end_date:endDate,
        end_time:endDate.getHours()+ ":" +endDate.getMinutes(),
        totalCost: totalCharge
    })
    
    setShow(true)
    // alert.success('You reserved the service successfully!')

    
    }
    return (
        <div className = "Scheduleform">
           
                 <label>Service:</label><br/>
                  <select id="service" onChange={handelChangeService}>
                      <option>Choose a service...</option>
                     {populateServices(props.services)}
                 </select>
                 <div className="NumOfPet">
                     <label>Number of pets:</label><br/>
                     <input type="number" min="0" step="1" value={numOfPets} onChange={(event)=>setNumOfPets(event.target.value)}/>
                 </div>
                 <label> Start Date and Time: </label><br/>
                <DatePicker
                    selected={startDate}
                    onChange={date => setStartDate(date)}
                    selectsStart
                    showTimeSelect
                    minTime={setHours(setMinutes(new Date(), 0), 8)}
                    maxTime={setHours(setMinutes(new Date(), 0), 20)}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    startDate={startDate}
                    endDate={endDate}
                /><br/>
                <label>End Date and Time:</label> <br/>
                <DatePicker
                    selected={endDate}
                    onChange={date => setEndDate(date)}
                    showTimeSelect
                    selectsEnd
                    minTime={setHours(setMinutes(new Date(), 0), 8)}
                    maxTime={setHours(setMinutes(new Date(), 0), 20)}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                />
                <br/>
                <label> Total charge: </label> 
                <div>
                {totalCharge}
                </div>
                <br/>
                <Button variant="outline-info" disabled={reserveBtn} onClick={handleClick}>Reserve service</Button>
                <>
      <Alert show={show} variant="success">
        <Alert.Heading> You reserved the service successfully!</Alert.Heading>
        <p>
         
          Looking forward to meet your pets!
        </p>
        <hr />
        <div className="d-flex justify-content-end">
          <Button onClick={() => setShow(false)} variant="outline-success">
          <AiOutlineClose/>
          </Button>
        </div>
      </Alert>

      
    </>
        </div>
    )
}
const mapStateToProps = (state) => {
    return{
      user:state.user.data.user
    }
  }
const mapDispatchToProps = dispatch=>{
    return{
        addSchedule: (data)=>postSchedule(data)(dispatch)
    }
} 
  export default connect(mapStateToProps,mapDispatchToProps)(ScheduleForm);