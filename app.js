document.addEventListener('DOMContentLoaded', ()=> {
    const showPlannerBtn = document.querySelector('.show-planner');    
    const plannerContainer = document.querySelector('.planner-container');
    const training = [];
    
    //exercise template
    class exercise {
        constructor(duration, power, downLimit, upLimit, downRPMLimit, upRPMLimit, rest, notes) {
            this.duration = duration;
            this.power = power;
            this.downLimit = downLimit;
            this.upLimit = upLimit;
            this.downRPMLimit = downRPMLimit;
            this.upRPMLimit = upRPMLimit;
            this.rest = rest;
            this.notes = notes;
        }
    }
    
    
})