import React from 'react'
import { connect } from 'react-redux'
import "react-datepicker/dist/react-datepicker.css";      
import CommentCard from '../components/company/CommentCard.js'
import ScheduleForm from '../components/schedule/ScheduleForm.js'
import {FaStar} from 'react-icons/fa'
import Card from "react-bootstrap/Card"
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import MiniLogin from '../components/company/MiniLogin'
import{updateAllSchedulesComment} from '../redux'
import Image from 'react-bootstrap/Image'

  const CompanyShowPage =(props)=> {

    const getCompany=()=>{
        let id= props.match.params.id
        let found = props.companies.find(comp=>comp.id==id)
        // if( found ===undefined){
        //     return null
        // }else{
            return found
        // }
    }


    const populateComments=()=>{

       let compSchedules = props.allSchedules.filter(sche=>sche.companyservice.company_id === getCompany().id)
  
       return compSchedules.map((schedule,index)=>{
        if(schedule.comment||schedule.rating){
            return <CommentCard key={index} schedule={schedule} updateAllSchedulesComment={props.updateAllSchedulesComment}/>
        }

      })
    }

    const getEachSerRating = (id)=>{
        let serCstHash = {}
 
       let compSches =  props.allSchedules.filter(sch=>
         sch.companyservice.company_id == props.match.params.id)


       compSches.map(sch=>{
      
        let k = sch.companyservice.id

            if(sch.rating){
                if(!serCstHash[k]){
                    serCstHash[k]=[sch.rating]
                }else{
                    serCstHash[k].push(sch.rating)
                }
            }
        })

       for( let k in serCstHash){
           if(k==id){
            
            let ratingRounded = serCstHash[k].reduce((a,b)=>a+b,0)/serCstHash[k].length
            ratingRounded= Math.round(ratingRounded*100)/100
            return ratingRounded + "("+ serCstHash[k].length +")"
           }
       }
       
    }
   
        //   if(getCompany()==null){
        //   return <h1>loading...</h1>
    //   }else{
    const { company_name,address_line,city,state,zip,services,picture1,picture2,picture3,description} =  getCompany()
       
const listOfServices=()=>services.map((ser,index)=><li key = {index}>{ser.service}: $ {ser.charge} 

{getEachSerRating(ser.companyservices_id)?
            <>
             <FaStar color={"#ffc107"}/> 
             {getEachSerRating(ser.companyservices_id)}
             </>
             
             :""}

</li>)
    
    const getScheduleForm = ()=><ScheduleForm services={services} company = {getCompany()}/>
        return (
           <Container>
            <div className="CompanyShowPage">
                 <div className="CompanyName">
               
                    <h1>{company_name}</h1>
                 </div>
                 <div className="Address">
                    <p>{address_line+", "+city + ", " + state+" "+zip}</p>
                 </div>
                 <div className="image">
                 <div className="row">
                     <div className="column">
                    
                     <Image src={picture1}  rounded />
                     </div>
                     <div className="column">
                     <Image src={picture2}  rounded />
                     </div>
                     <div className="column">
                     <Image src={picture3}  rounded />
                     </div>
                     </div>
                 </div>
                 <br/>
                 <div className = "Services">
                    <strong>Services:</strong> 
                    <ul>
                        {listOfServices()}
                    </ul>
                 </div>
                 <div className="Description">
                   <strong> Description: </strong><p>{description}</p>
                 </div>
                {props.user?
                <div className="ScheduleForm"> 
                <Card
                    bg='light'
                    text='dark' 
                    style={{ width: '22rem' }}
                     >
                    <Card.Header>Schedule a service</Card.Header>
                    <Card.Body>

                                {getScheduleForm()}
                           
                    </Card.Body>
                </Card>
                </div> 
                 :
                 <div className="AskToLogIn">
                      <Card
                    bg='light'
                    text='dark' 
                    style={{ width: '18rem' }}
                     >
                    <Card.Header>Log in to schedule a service</Card.Header>
                    <Card.Body>

                    <MiniLogin props={props}/>
                           
                    </Card.Body>
                </Card>
              
                 </div>
                 }
                 
                <div className="Comments">
               <h5> <strong>Comments:</strong></h5>
                {populateComments()}
                
                </div>
            </div>
            </Container>
        )}
    // }

const mapStateToProps = (state) => {
    return{
      companies:state.company.display,
      schedules:state.schedule.data,
      user:state.user.data.user,
      allSchedules: state.allSchedules.data
    }
  }
  const mapDispatchToProps = dispatch=>{
    return{
        updateAllSchedulesComment: (data)=>dispatch(updateAllSchedulesComment(data))
    }}

  export default connect(mapStateToProps,mapDispatchToProps)(CompanyShowPage);