import React, { Component } from 'react'
import axios from 'axios';
import cookie from 'react-cookies';

const headers = {
    'Content-Type': 'application/json',
    'Authorization' : "Bearer "+ cookie.load('access-token')
};
const ip="20.41.86.4:5000";
class Followings extends Component {
    constructor(props) {
        super(props)

        this.state = {
               followings: []  
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value,
        })
      }
    
      firstData = () => {
        console.log("user: " + this.state.userid);
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        
        if(dd<10) {
            dd='0'+dd
        } 
        if(mm<10) {
            mm='0'+mm
        } 
        var td = yyyy+'-'+mm+'-'+dd;
      
        axios.get(`http://${ip}/follow/searchuser/${this.state.userid}/${td}/${(today.getTime())*1000}`, {
          headers: {
            "Authorization" : "Bearer " + cookie.load('access-token')
          }
        }).then(res => {
            if (res.data.errorCode == 10) {
              var arr = Array.from(res.data.data);
              console.log("arrr: ", arr);
              if (arr.length) {
                  this.setState({
                      lt:arr[arr.length-1].timestamp,
                      ld:arr[arr.length-1].date
                  });
                  console.log("lt: " + this.state.lt + ", ld: " + this.state.ld);
              }
             
            }
        }).catch(e => {
            console.log(e);
        }) 
      }
    

    
      getPastData=()=> {
        
          axios.get(`http://${ip}/follow/searchuser/${this.state.userid}/${this.state.ld}/${this.state.lt}`, {
            headers: {
              "Authorization" : "Bearer " + cookie.load('access-token')
            }
          }).then(res => {
              if (res.data.errorCode == 10) {
                console.log("get20 success\n");
                var arr = res.data.data;
                console.log(arr);
                if (arr.length) {
                    this.setState({
                        lt:arr[arr.length-1].timestamp,
                        ld:arr[arr.length-1].date
                    });
                } else {
                  alert("없음");
                }
               }
          }).catch(e => {
              console.log(e);
          })  
      
      }
    
      
    

    
      componentDidMount() {

        axios.get(`http://${ip}/follow/flist/tlatldms`, {
            headers: headers
           }).then(res => {
            console.log("follow "+res.data.followings);
            if (res.data.errorCode == 10) {
                this.setState({
                    followings : res.data.followings,
                    userid:res.data.followings[3]
                });
            }  else {
               
                console.log("err");
            }
        }).catch(e => {
            
            console.log(e);
        })

      }


    render() {


        return (
            <div>
               
                <button onClick={this.firstData}>지금</button>
                <button onClick={this.getPastData}>getpast10</button>
            </div>
        )
    }
}

export default Followings
