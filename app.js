document.addEventListener('DOMContentLoaded', ()=> {
    const showPlannerBtn = document.querySelector('.show-planner');
    const startTrainingBtn = document.querySelector('.start-training');
    const trainBtn = document.querySelector('.train-btn');    
    const plannerContainer = document.querySelector('.planner-container');
    const addExerciseBtn = document.querySelector('.add-exercise-btn');
    const limitForm = document.getElementById('limits');    
    const ftpInput = document.getElementById('ftp');
    const hrMaxInput = document.getElementById('hrMax');
    const ageInput = document.querySelector('.age-container');
    const exercisesContainer = document.querySelector('.exercises-container');
    const trainingTimeDisplay = document.querySelector('.training-duration');
    const secondRowH2 = document.querySelector('.second-row .current-exe-time');
    const displayContainer = document.querySelector('.display-container');
    const commingNext = document.querySelector('.comming-next');
    let currentExerciseId = 0;
    let trainingTime = 0;
    let timelineWidth = [];
    let currentTime = 0;
    let currentPosition = 0;
    let mulipliedCurrentPosition = 0;
    let timeUnit = '';    
    let clonedExerciesTimeline;
    let currentPositionLine;   
    const exercisesTimeline = document.querySelector('.timeline-container');
    const exercisesTimelineContainer = displayContainer.querySelector('.sixth-row');
    const training = [];
    const exercisesForms = [];
    const exercisesTimelines = [];
    const primaryExeTimelineArr = [];
    const secondaryExeTimelineArr = [];
    const primaryCurrentTimeLine = [];
    const secondaryCurrentPositinLine = [];
    const exercisesStartingTimes = [];
    const exeTimeouts = [];    
    let intervalId;    
    let ftp = 0;
    let hrMax = 185;
    let limitType = 'ftp';
    const exercisesBgColors = [
        'lightblue', 'lightgreen', 'green', 'yellow', 'orange', 'red', 'purple'
    ];

    //show exercises planner
    showPlannerBtn.addEventListener('click', showPlanner);

    //hide exercises planner and start training
    trainBtn.addEventListener('click', train);

    //start training
    startTrainingBtn.addEventListener('click', startTraining);

    //take data from limits form
    limitForm.addEventListener('change', setLimits);

    //set Limits function
    function setLimits (e) {
        if (e.target.name === "ftp") {
            ftp = e.target.value;
        }
        if (e.target.name === 'hrMax') {
            hrMax = e.target.value;
        }        
        limitType = limitForm.chosenLimitType.value;
        if (limitForm.doNotKnowMyHrMax.checked) {
            ageInput.style.display = 'flex';
        } else {
            ageInput.style.display = 'none';
        }
        if (limitForm.age.value < 0) {
            alert('Age value must be bigger than 0');
            limitForm.age.value = 1;
        }
        if (limitForm.age.value > 220) {
            alert('Are you serious???');
            limitForm.age.value = 1;
        }
        if (limitForm.doNotKnowMyHrMax.checked) {
            hrMax = 220 - limitForm.age.value;
            limitForm.hrMax.value = hrMax;
        }
        if (training.length > 0) {
            renderExercisesTimelines(); //update exercises
        }
        if (exercisesForms.length > 0) { //if limits based od hrMax exercises limits cant go above hrMax
            exercisesForms.forEach(element => {
                if (element.upperLimit.value > hrMax && limitType === 'hrMax') {
                    element.upperLimit.value = hrMax;
                }
                if (element.lowerLimit.value > hrMax && limitType === 'hrMax') {
                    element.lowerLimit.value = hrMax;
                }
                if (limitForm.doNotKnowMyHrMax.checked && limitType === 'hrMax' && (220 - limitForm.age.value) < element.upperLimit.value) {
                    element.upperLimit.value = hrMax;
                }
                if (limitForm.doNotKnowMyHrMax.checked && limitType === 'hrMax' && (220 - limitForm.age.value) < element.lowerLimit.value) {
                    element.lowerLimit.value = hrMax;
                }
            })
            training.forEach(element => {
                if (element.upperLimit && limitType === 'hrMax' > hrMax) {
                    element.upperLimit = hrMax;
                }
                if (element.lowerLimit && limitType === 'hrMax' > hrMax) {
                    element.lowerLimit = hrMax;
                }
                if (limitForm.doNotKnowMyHrMax.checked && limitType === 'hrMax' && (220 - limitForm.age) < element.upperLimit) {
                    element.upperLimit = hrMax;
                }
                if (limitForm.doNotKnowMyHrMax.checked && limitType === 'hrMax' && (220 - limitForm.age) < element.lowerLimit) {
                    element.lowerLimit = hrMax;
                } 
            })
        }
                                        
    }

    //formatting seconds to H:MM:SS
    function getFormatedTrainingTime () {
        let hoursCount = Math.floor(trainingTime/3600);
        let minutesCount = Math.floor(trainingTime % 3600 / 60);
        let secondsCount = trainingTime % 60;
        if (minutesCount < 10) {
            minutesCount = '0' + minutesCount;
        };
        if (secondsCount < 10) {
            secondsCount = '0' + secondsCount;
        };
        let formatedTrainingTime = hoursCount + ': ' + minutesCount + ': ' + secondsCount;
        return formatedTrainingTime;
    }
    
    //formatting hundreds of miliseconds to H:MM:SS:0,1MS
    function getFormatedTrainingTimeFromMs () {
        let hoursCount = Math.floor(currentTime/6000);
        let minutesCount = Math.floor(currentTime % 6000 / 600);
        let secondsCount = Math.floor(currentTime % 600 / 10);
        let hundredMilisecondsCount = currentTime % 10;
        if (minutesCount < 10) {
            minutesCount = '0' + minutesCount;
        };
        if (secondsCount < 10) {
            secondsCount = '0' + secondsCount;
        };
        let formatedTrainingTime = hoursCount + ': ' + minutesCount + ': ' + secondsCount + ': ' + hundredMilisecondsCount;
        return formatedTrainingTime;
    }

    //add new exercise from and push exercise object to the training array
    addExerciseBtn.addEventListener('click', addExercise);
    function addExercise() {
        let exercise = new Exercise(currentExerciseId, '', 0, 'minutes', 0, 0, 0, 0, '');
        training.push(exercise);        
        addExerciseForm(currentExerciseId); //adds exercise from
        addExerciseTimeline(currentExerciseId); //add exercise Timeline
        currentExerciseId++;             
    }

    function addExerciseForm(currentExerciseId) {
        const form = document.createElement('form');
        form.classList.add('add-exercise');
        form.dataset.id = currentExerciseId;
        form.setAttribute('name', 'exe' + currentExerciseId);
        form.setAttribute('id', 'exe' + currentExerciseId);
        exercisesContainer.appendChild(form);
        const button = document.createElement('button');
        //close button
        button.innerText = 'X';
        button.classList.add('remove-excercise-btn');
        button.dataset.id = currentExerciseId;
        button.setAttribute('id', 'btn' + currentExerciseId);
        button.addEventListener('click', removeExercise);
        form.appendChild(button);
        //exercise name
        const exerciseNameContainer = document.createElement('div');
        exerciseNameContainer.classList.add('exercise-name-input-container');
        form.appendChild(exerciseNameContainer);
        const exerciseNameLabel = document.createElement('label');
        exerciseNameLabel.setAttribute('for', 'exerciseName');
        exerciseNameLabel.innerText = 'Exercise name';
        exerciseNameContainer.appendChild(exerciseNameLabel);
        const exerciseNameInput = document.createElement('input');
        exerciseNameInput.setAttribute('name', 'exerciseName');        
        exerciseNameInput.setAttribute('type', 'text');
        exerciseNameInput.setAttribute('id', 'name' + currentExerciseId);        
        exerciseNameInput.classList.add('number-input');
        exerciseNameContainer.appendChild(exerciseNameInput);
        //duration
        const durationFieldset = document.createElement('fieldset');
        form.appendChild(durationFieldset);
        const durationLegend = document.createElement('legend');
        durationLegend.innerText = 'Duration';
        durationFieldset.appendChild(durationLegend);
        const durationInputContainer = document.createElement('div');
        durationInputContainer.classList.add('duration-input-container');
        durationFieldset.appendChild(durationInputContainer);
        const durationLabel = document.createElement('label');
        durationLabel.setAttribute('for', 'duration');
        durationLabel.innerText = 'Duration';
        durationInputContainer.appendChild(durationLabel);
        const durationInput = document.createElement('input');
        durationInput.setAttribute('name', 'duration');
        durationInput.setAttribute('type', 'number');
        durationInput.setAttribute('id', 'duration' + currentExerciseId);
        durationInput.setAttribute('min', '0');
        durationInput.classList.add('number-input');
        durationInputContainer.appendChild(durationInput);
        //duration units
        const durationUnitsInputsContainer = document.createElement('div');
        durationUnitsInputsContainer.classList.add('duration-units-inputs');
        durationFieldset.appendChild(durationUnitsInputsContainer);
        //seconds        
        const durationSecondsUnitContainer = document.createElement('div');
        durationSecondsUnitContainer.classList.add('duration-seconds');        
        durationUnitsInputsContainer.appendChild(durationSecondsUnitContainer);
        const secondsLabel = document.createElement('label');
        secondsLabel.setAttribute('for', 'seconds');
        secondsLabel.innerText = 'Seconds';
        durationSecondsUnitContainer.appendChild(secondsLabel);
        const secondsInput = document.createElement('input');
        secondsInput.setAttribute('name', 'durationUnit');
        secondsInput.setAttribute('id', 'seconds' + currentExerciseId);
        secondsInput.setAttribute('value', 'seconds');
        secondsInput.setAttribute('type', 'radio');        
        secondsInput.classList.add('number-input');
        durationSecondsUnitContainer.appendChild(secondsInput);
        //minutes       
        const durationMinutesUnitContainer = document.createElement('div');
        durationMinutesUnitContainer.classList.add('duration-minutes');        
        durationUnitsInputsContainer.appendChild(durationMinutesUnitContainer);
        const minutesLabel = document.createElement('label');
        minutesLabel.setAttribute('for', 'minutes');
        minutesLabel.innerText = 'Minutes';
        durationMinutesUnitContainer.appendChild(minutesLabel);
        const minutesInput = document.createElement('input');
        minutesInput.setAttribute('name', 'durationUnit');
        minutesInput.setAttribute('id', 'minutes' + currentExerciseId);
        minutesInput.setAttribute('value', 'minutes');
        minutesInput.setAttribute('type', 'radio');
        minutesInput.setAttribute('checked', true);        
        minutesInput.classList.add('number-input');
        durationMinutesUnitContainer.appendChild(minutesInput);
        
        //power/hr limits
        const limitsFieldset = document.createElement('fieldset');
        form.appendChild(limitsFieldset);
        const legend = document.createElement('legend');
        legend.innerText = 'Limits';
        limitsFieldset.appendChild(legend);
        //limits type
        const limitTypeInputsContainer = document.createElement('div');
        limitTypeInputsContainer.classList.add('limit-type-inputs');
        limitsFieldset.appendChild(limitTypeInputsContainer);
        //power
        //inputs        
        //upper limit
        const upperLimitInputContainer = document.createElement('div');
        upperLimitInputContainer.classList.add('upper-limit-input-container');
        limitsFieldset.appendChild(upperLimitInputContainer);
        const upperLimitLabel = document.createElement('label');
        upperLimitLabel.setAttribute('for', 'upperLimit');
        upperLimitLabel.innerText = 'Upper limit';
        upperLimitInputContainer.appendChild(upperLimitLabel);
        const upperLimitInput = document.createElement('input');
        upperLimitInput.setAttribute('name', 'upperLimit');        
        upperLimitInput.setAttribute('type', 'number');
        upperLimitInput.setAttribute('id', 'upperLimit' + currentExerciseId);
        upperLimitInput.setAttribute('min', '0');       
        upperLimitInput.classList.add('number-input');
        upperLimitInputContainer.appendChild(upperLimitInput);
        //lower limit
        const lowerLimitInputContainer = document.createElement('div');
        lowerLimitInputContainer.classList.add('lower-limit-input-container');
        limitsFieldset.appendChild(lowerLimitInputContainer);
        const lowerLimitLabel = document.createElement('label');
        lowerLimitLabel.setAttribute('for', 'lowerLimit');
        lowerLimitLabel.innerText = 'Lower limit';
        lowerLimitInputContainer.appendChild(lowerLimitLabel);
        const lowerLimitInput = document.createElement('input');
        lowerLimitInput.setAttribute('name', 'lowerLimit');        
        lowerLimitInput.setAttribute('type', 'number');
        lowerLimitInput.setAttribute('id', 'lowerLimit' + currentExerciseId);
        lowerLimitInput.setAttribute('min', '0');        
        lowerLimitInput.classList.add('number-input');
        lowerLimitInputContainer.appendChild(lowerLimitInput);

        //cadence
        const cadenceFieldset = document.createElement('fieldset');
        form.appendChild(cadenceFieldset);
        const cadenceLegend = document.createElement('legend');
        cadenceLegend.innerText = 'Cadence limits';
        cadenceFieldset.appendChild(cadenceLegend);        
        //cadence upper limit
        const upperCadenceLimitInputContainer = document.createElement('div');
        upperCadenceLimitInputContainer.classList.add('upper-cadence-limit-input-container');
        cadenceFieldset.appendChild(upperCadenceLimitInputContainer);
        const cadenceUpperLimitLabel = document.createElement('label');
        cadenceUpperLimitLabel.setAttribute('for', 'upperCadenceLimit');
        cadenceUpperLimitLabel.innerText = 'Upper RPM limit';
        upperCadenceLimitInputContainer.appendChild(cadenceUpperLimitLabel);
        const cadenceUpperLimitInput = document.createElement('input');
        cadenceUpperLimitInput.setAttribute('name', 'upperCadenceLimit');        
        cadenceUpperLimitInput.setAttribute('type', 'number');
        cadenceUpperLimitInput.setAttribute('id', 'upperCadenceLimit' + currentExerciseId);
        cadenceUpperLimitInput.setAttribute('min', '0');
        cadenceUpperLimitInput.setAttribute('max', '300');       
        cadenceUpperLimitInput.classList.add('number-input');
        upperCadenceLimitInputContainer.appendChild(cadenceUpperLimitInput);
        //cadence lower limit
        const lowerCadenceLimitInputContainer = document.createElement('div');
        lowerCadenceLimitInputContainer.classList.add('lower-cadence-limit-input-container');
        cadenceFieldset.appendChild(lowerCadenceLimitInputContainer);
        const cadenceLowerLimitLabel = document.createElement('label');
        cadenceLowerLimitLabel.setAttribute('for', 'lowerCadenceLimit');
        cadenceLowerLimitLabel.innerText = 'Lower RPM limit';
        lowerCadenceLimitInputContainer.appendChild(cadenceLowerLimitLabel);
        const cadenceLowerLimitInput = document.createElement('input');
        cadenceLowerLimitInput.setAttribute('name', 'lowerCadenceLimit');        
        cadenceLowerLimitInput.setAttribute('type', 'number');
        cadenceLowerLimitInput.setAttribute('id', 'lowerCadenceLimit' + currentExerciseId);  
        cadenceLowerLimitInput.setAttribute('min', '0');  
        cadenceLowerLimitInput.setAttribute('max', '300');     
        cadenceLowerLimitInput.classList.add('number-input');
        lowerCadenceLimitInputContainer.appendChild(cadenceLowerLimitInput);
        
        //notes
        const notesInputContainer = document.createElement('div');
        notesInputContainer.classList.add('notes-input-container');
        form.appendChild(notesInputContainer);
        const notesLabel = document.createElement('label');
        notesLabel.setAttribute('for', 'notes');
        notesLabel.innerText = 'Notes';
        notesInputContainer.appendChild(notesLabel);
        const notesInput = document.createElement('input');
        notesInput.setAttribute('name', 'notes');        
        notesInput.setAttribute('type', 'text');
        notesInput.setAttribute('id', 'notes' + currentExerciseId);        
        notesInput.classList.add('number-input');
        notesInputContainer.appendChild(notesInput);
        //add readForm function
        form.addEventListener('change', readForm)
        //push form to exercisesForms array
        exercisesForms.push(form);             
    }

    //limit zones template
    class PowerZones {
        constructor(ftp) {
            this.first = [0, Math.floor(ftp * 0.55), 'Active recovery'];
            this.second = [Math.floor(ftp * 0.55), Math.floor(ftp * 0.75), 'Aerobic treshold'];
            this.third = [Math.floor(ftp * 0.75), Math.floor(ftp * 0.9), 'Tempo'];
            this.fourth = [Math.floor(ftp * 0.9), Math.floor(ftp * 1.05), 'Lactate Treshold'];
            this.fifth = [Math.floor(ftp * 1.05), Math.floor(ftp * 1.2), 'Aerobic capacity'];
            this.sixth = [Math.floor(ftp * 1.2), Math.floor(ftp * 1.5), 'Anaerobic capatiy'];
            this.sixth = [Math.floor(ftp * 1.5), Infinity, 'Neuromuscular'];
        }
    }
    

    //exercise template
    class Exercise {
        constructor(id, name, duration, durationUnit, lowerLimit, upperLimit, lowerCadenceLimit, upperCadenceLimit, notes) {
            this.id = id;
            this.exerciseName = name;
            this.duration = duration;
            this.durationUnit = durationUnit;            
            this.lowerLimit = lowerLimit;
            this.upperLimit = upperLimit;
            this.lowerCadenceLimit = lowerCadenceLimit;
            this.upperCadenceLimit = upperCadenceLimit;            
            this.notes = notes;
        }
    }

    //show exercises planner
    function showPlanner() {
        showPlannerBtn.style.display = 'none';
        startTrainingBtn.style.display = 'none';
        displayContainer.style.display = 'none';        
        if (plannerContainer.style.display === 'flex' || plannerContainer.style.display === '') { // if we press Open Planner button while planner is disappearing
            setTimeout(()=> {
                plannerContainer.style.display = 'flex';
                plannerContainer.style.opacity = '0';
                setTimeout(()=> plannerContainer.style.opacity = '1', 1000);
            }, 1000)
        } else {
            plannerContainer.style.display = 'flex';
            plannerContainer.style.opacity = '0';
            setTimeout(()=> plannerContainer.style.opacity = '1', 1);
        }
        if (secondaryExeTimelineArr.length > 0) {            
            exercisesTimelineContainer.removeChild(secondaryExeTimelineArr[0]);
            secondaryExeTimelineArr.pop();
        }
        if (secondaryCurrentPositinLine.length > 0) { // remove currentPositionLines when going back to planner
            for (let i = 0; i < secondaryCurrentPositinLine.length; i ++) {
                secondaryCurrentPositinLine.pop();
            }
        }
        if (exercisesStartingTimes.length > 0) {
            for (let i = 0; i < training.length; i++) {                
                exercisesStartingTimes.pop();                
            }
        }
    }

    //train function
    function train() {        
        //check if every exercise has neccessary data
        if (
            training.every(element => {
            return element.duration > 0 && element.lowerLimit > 0 && element.upperLimit > 0
        }) && training.length > 0
        ) {
            plannerContainer.style.opacity = '0';        
            showPlannerBtn.style.display = 'inline-block';
            startTrainingBtn.style.display = 'inline-block';
            setTimeout(()=> {
                showPlannerBtn.style.opacity = '1';
                startTrainingBtn.style.opacity = '1';
            }, 1);
            setTimeout(()=>  plannerContainer.style.display = 'none', 999);
            displayContainer.style.display = 'flex';
            displayContainer.style.opacity = '0';
            setTimeout(()=> displayContainer.style.opacity = '1', 999);
            if (training.length > 0) {
                clonedExerciesTimeline = exercisesTimeline.cloneNode(true);            
                exercisesTimelineContainer.appendChild(clonedExerciesTimeline);
                secondaryExeTimelineArr.push(clonedExerciesTimeline);               
                trainingTimeDisplay.innerText = "Training duration " + getFormatedTrainingTime();                         
            }
            let startingTime = 0;
            for (let i = 1; i <= training.length; i++) {                
                exercisesStartingTimes.push(startingTime);
                if (training[i-1].durationUnit === 'minutes') {
                    startingTime += training[i-1].duration*60;
                } else if (training[i-1].durationUnit === 'seconds') {
                    startingTime += training[i-1].duration;
                }
            }
            console.log(exercisesStartingTimes)
        } else {
            alert('At least one exercise must be chosen and exercise duration, lower limit and upper limit must be higher than 0')
        }    
        
    }

    //start training
    function startTraining() {               
        showPlannerBtn.style.display = 'none';
        startTrainingBtn.innerText = 'Pause';
        startTrainingBtn.removeEventListener('click', startTraining);
        startTrainingBtn.addEventListener('click', pause);
        setDisplayExercisesDetailsTimeouts();
        intervalId = setInterval(trainingFunction, 100);

        //as intervals counted in seconds are multiplied by three when establishing representing them divs widths, we have to calculate timeline width // to place time pointer in right position
        let exeDurationTimes = [];
        training.forEach(element => {
            if (element.durationUnit === 'seconds') {
                exeDurationTimes.push(element.duration * 3);
            } else if (element.durationUnit === 'minutes') {
                exeDurationTimes.push(element.duration * 60)
            }
        });
        timelineWidth = exeDurationTimes.reduce((prev, current) => {
            return prev + current;
        })
        console.log(timelineWidth)
        //time pointer
        if (secondaryExeTimelineArr.length > 0) {
            clonedExerciesTimeline.style.position = 'relative';
            currentPositionLine = document.createElement('div');            
            secondaryCurrentPositinLine.unshift(currentPositionLine);            
            if(secondaryCurrentPositinLine.length > 1) {
                secondaryExeTimelineArr[0].removeChild(secondaryCurrentPositinLine[1]);
                secondaryCurrentPositinLine.pop();
            }
            currentPositionLine.style.position = 'absolute';
            currentPositionLine.style.left = currentPosition + '%';
            currentPositionLine.style.height = '100%';
            currentPositionLine.style.width = '2px';
            currentPositionLine.style.backgroundColor = 'orangered';
            secondaryExeTimelineArr[0].appendChild(currentPositionLine);                                  
        }
        
    }

    //pause function
    function pause () {
        showPlannerBtn.style.display = 'inline-block';
        startTrainingBtn.innerText = 'Start';        
        startTrainingBtn.removeEventListener('click', pause);
        startTrainingBtn.addEventListener('click', startTraining);
        clearInterval(intervalId);
    }

    //training function
    function trainingFunction () {
        currentTime++;
        if (timeUnit === 'seconds') {
            mulipliedCurrentPosition++;
            mulipliedCurrentPosition++;
            mulipliedCurrentPosition++;
        } else if (timeUnit === 'minutes') {
            mulipliedCurrentPosition++;
        }
        currentPosition = mulipliedCurrentPosition / (timelineWidth * 10) * 100;        
        currentPositionLine.style.left = currentPosition +'%';
        trainingTimeDisplay.innerText = 'Training time ' + getFormatedTrainingTimeFromMs();
        if (currentTime === trainingTime * 10 ) { // when training is finished
            clearInterval(intervalId);
            trainingTimeDisplay.innerText = 'Training time ' + currentTime + ' The End';
            currentTime = 0;
            showPlannerBtn.style.display = 'inline-block';
            startTrainingBtn.innerText = 'Start';
            startTrainingBtn.removeEventListener('click', pause);
            startTrainingBtn.addEventListener('click', startTraining);
        }
    }

    //function set display exercises details timeouts
    function setDisplayExercisesDetailsTimeouts () {
        exercisesStartingTimes.forEach((element, index) =>  {
            let exeTimeout = setTimeout(()=> {
                secondRowH2.innerText = training[index].exerciseName;
                timeUnit = training[index].durationUnit; //set timeUnit for time pointer
                if (training[index].durationUnit === 'minutes') { //Count Down to next exercise
                    let count = 5;
                    let countDownInterval;
                    let countDown = setTimeout(() => {
                            countDownInterval = setInterval(()=> {
                            commingNext.innerText = count;
                            count--;
                        }, 1000)
                    }, training[index].duration * 60000 - 5000);
                    let countDown2 = setTimeout(()=> {
                        clearInterval(countDownInterval);
                    }, training[index].duration * 60000)
                } else if (training[index].durationUnit === 'seconds') { //Count Down to next exercise
                    let count = 5;
                    let countDownInterval;
                    let countDown = setTimeout(() => {
                            countDownInterval = setInterval(()=> {
                            commingNext.innerText = count;
                            count--;
                        }, 1000)
                    }, training[index].duration * 1000 - 5000);
                    let countDown2 = setTimeout(()=> {
                        clearInterval(countDownInterval);
                    }, training[index].duration * 1000)
                }       
            }, element*1000)
        })
    }

    //remove exercise
    function removeExercise(e) {
        e.preventDefault();
        const formToRemove = document.querySelector('form[data-id="' + e.target.dataset.id +'"]');
        exercisesContainer.removeChild(formToRemove);
        trainingTime -= training[exercisesForms.indexOf(formToRemove)].duration; //reduce training time
        training.splice(exercisesForms.indexOf(formToRemove), 1); //remove exercise object
        exercisesTimelines.splice(exercisesForms.indexOf(formToRemove), 1); //remove exercise timeline div from array
        exercisesForms.splice(exercisesForms.indexOf(formToRemove), 1); //remove exercise form
        const exerciseTimelineToRemove = exercisesTimeline.querySelector('#exeTimeline' + e.target.dataset.id);
        exercisesTimeline.removeChild(exerciseTimelineToRemove); //remove exercise timeline        
        renderExercisesTimelines();                       
    }

    //readForm function
    function readForm(e) {  
        const exerciseIndex = exercisesForms.indexOf(this);      
        if (e.target.name === 'duration' || e.target.name === 'id' ||
        e.target.name === 'lowerLimit' || e.target.name === 'upperLimit' ||
        e.target.name === 'lowerCadenceLimit' || e.target.name === 'upperCadenceLimit') {
            training[exerciseIndex][e.target.name] = parseInt(e.target.value);                        
        } else {
            training[exerciseIndex][e.target.name] = e.target.value;
        }
        if (e.target.name === 'upperLimit' && e.target.value < training[exerciseIndex]['lowerLimit']) {
            alert('Upper limit cannot be lower than lower limit!');
            this.lowerLimit.value = 0;
            training[exerciseIndex]['lowerLimit'] = 0;
        }
        if (e.target.name === 'upperCadenceLimit' && e.target.value < training[exerciseIndex]['lowerCadenceLimit']) {
            alert('Upper limit cannot be lower than lower limit!');
            this.lowerCadenceLimit.value = 0;
            training[exerciseIndex]['lowerCadenceLimit'] = 0;
        }
        if (e.target.name === 'upperLimit' && limitType === 'hrMax' && e.target.value > hrMax) {
            alert('You cannot go above your HrMax!');
            e.target.value = hrMax;
            training[exerciseIndex]["upperLimit"] = hrMax;
        }
        if (e.target.name === 'lowerLimit' && e.target.value > training[exerciseIndex]['upperLimit']) {
            alert('Lower limit cannot be higher than upper limit!');
            e.target.value = 0;
            training[exerciseIndex]['lowerLimit'] = 0;
        }
        if (e.target.name === 'lowerLimit' && limitType === 'hrMax' && e.target.value > hrMax) {
            alert('You cannot go above your HrMax!');
            e.target.value = hrMax;
            training[exerciseIndex]["lowerLimit"] = hrMax;
        }
        if (e.target.name === 'lowerCadenceLimit' && e.target.value > training[exerciseIndex]['upperCadenceLimit']) {
            alert('Lower limit cannot be higher than upper limit!');
            e.target.value = 0;
            training[exerciseIndex]['lowerCadenceLimit'] = 0;
        }               
        renderExercisesTimelines();
    }

    //add exercise timeline
    function addExerciseTimeline(currentExerciseId) {
        const exerciseTimeline = document.createElement('div');
        exerciseTimeline.setAttribute('id', 'exeTimeline' + currentExerciseId);
        exercisesTimeline.appendChild(exerciseTimeline);
        exercisesTimelines.push(exerciseTimeline);        
    }    

    //render Exercises Timelines
    function renderExercisesTimelines() {
        //count training time
        trainingTime = training.reduce(function (total, current) {
            if (current.durationUnit === 'minutes') {
                return total + current.duration * 60;
            } else {
               return total + parseInt(current.duration);
            }            
        }, 0)        
        //setting divs width
        exercisesTimelines.forEach((element, index) => {
            let currentExerciseDuration = 0;
            if (training[index].durationUnit === 'minutes') {
                currentExerciseDuration = training[index].duration * 60;
            } else {
                currentExerciseDuration = training[index].duration * 3; //multiply for better visibility 
            }
            element.style.width = Math.round(currentExerciseDuration / trainingTime * 10000) / 100 + '%';    
        })

        //counting div height
        if (limitType === 'hrMax') {   ///if limits based on hrMax
            exercisesTimelines.forEach((element, index) => {                
                element.style.height = Math.round(training[index].upperLimit / hrMax * 10000) / 100 + '%';
                if (training[index].upperLimit > hrMax) {
                    element.style.height = '100%';
                }
                //color divs
                element.style.backgroundImage = 'linear-gradient(to top, lightblue 0%, lightblue ' + Math.floor(hrMax / training[index].upperLimit * 100 * 0.6) + '%, lightgreen ' + Math.floor(hrMax / training[index].upperLimit * 100 * 0.6) + '%, lightgreen '  + Math.floor(hrMax / training[index].upperLimit * 100 * 0.7) + '%, lightyellow ' + Math.floor(hrMax / training[index].upperLimit * 100 * 0.7) + '%, lightyellow '  + Math.floor(hrMax / training[index].upperLimit * 100 * 0.8) + '%, orange ' + Math.floor(hrMax / training[index].upperLimit * 100 * 0.8) + '%, orange ' + Math.floor(hrMax / training[index].upperLimit * 100 * 0.9) + '%, red ' + Math.floor(hrMax / training[index].upperLimit * 100 * 0.9) + '%, red 100%)';
                //when limits exist draw border                               
                if (training[index].lowerLimit >= 0 && training[index].upperLimit > 0 && training[index].duration > 0) {
                    element.style.border = '1px solid black';
                }
            })
        } else if (limitType === 'ftp') {   //if limits based on power
            let exercisesTimelineHeightReferenceValue = training.reduce(function (prevValue, currentValue) {          
                return Math.max(prevValue, currentValue.upperLimit);            
            }, -1)            
            //looking for max limit value        
            //setting divs height and bacground color
            exercisesTimelines.forEach((element, index) => {            
                element.style.height = Math.round(training[index].upperLimit / exercisesTimelineHeightReferenceValue * 10000) / 100 + '%';
                //pick bgcolor corresponding to training zone            
                if (ftp > 1) {   ///if user defined his ftp we color the divs
                    element.style.backgroundImage = 'linear-gradient(to top, lightblue 0%, lightblue ' + Math.floor(ftp / training[index].upperLimit * 100 * 0.55) + '%, lightgreen ' + Math.floor(ftp / training[index].upperLimit * 100 * 0.55) + '%, lightgreen '  + Math.floor(ftp / training[index].upperLimit * 100 * 0.75) + '%, lightyellow ' + Math.floor(ftp / training[index].upperLimit * 100 * 0.75) + '%, lightyellow '  + Math.floor(ftp / training[index].upperLimit * 100 * 0.9) + '%, orange ' + Math.floor(ftp / training[index].upperLimit * 100 * 0.9) + '%, orange ' + Math.floor(ftp / training[index].upperLimit * 100 * 1.05 ) + '%, pink ' + Math.floor(ftp / training[index].upperLimit * 100 * 1.05) + '%, pink ' + Math.floor(ftp / training[index].upperLimit * 100 * 1.2) + '%, red ' + Math.floor(ftp / training[index].upperLimit * 100 * 1.2) + '%, red ' + Math.floor(ftp / training[index].upperLimit * 100 * 1.5) + '%, purple ' + Math.floor(ftp / training[index].upperLimit * 100 * 1.5) + '%, purple ' + Math.floor(ftp / training[index].upperLimit * 1000) + '%)';
                } else {                
                    element.style.backgroundImage = 'linear-gradient(to top, lightblue 0%, lightblue ' + Math.floor(training[index].lowerLimit / training[index].upperLimit * 100) + '%, grey ' + Math.floor(training[index].lowerLimit / training[index].upperLimit * 100) + '%, grey 100%)';
                }            
                 //when limits exist draw border
                if (training[index].lowerLimit >= 0 && training[index].upperLimit > 0 && training[index].duration) {
                element.style.border = '1px solid black'; 
                }                        
            })
        }      
    }

    
    
})