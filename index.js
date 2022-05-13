function dropdownFunction(x) {
    document.getElementById(x).classList.toggle("show");
  }
  
  window.onclick = function(event) {
    if (!event.target.matches('.dropButton')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }


let cellWithStartPoint = -1, cellWithEndPoint = -1;
let listOFBlockCells = [];
let isRoadBuilding = false;

let isChanged = false;

let sourceElement = "Plutonijum 239";
let shield = "Papir";

let isCalculating = false;
let radiation=0;
let distance=0;

  function allowDrop(ev) {
      ev.preventDefault();
  }
  function drag(ev) {
      ev.dataTransfer.setData("text", ev.target.id);
  }
    
  function drop(ev) {
      ev.preventDefault();
        let data = ev.dataTransfer.getData("text");
        if(ev.target.nodeName != 'IMG' && document.getElementById(data) != null){
            if(data == "source"){
                cellWithStartPoint = parseInt(ev.target.id);
                isChanged=true;
            }
            if(data == "detector"){
                cellWithEndPoint = parseInt(ev.target.id);
                isChanged=true;
            }
            ev.target.appendChild(document.getElementById(data));    
        }
  }
  
  let table = () => {
      let isBlockActive = false;
      let isEraserActive = false;
      let isMousePressedWithBlockActive = false;
      let isMousePressedWithEraserActive = false;
      let numberOfCollums = 0;
      let isRoadActive = false;
      let roads = []
  
      function constructCords(numberOfCell){
          let x = Math.floor((numberOfCell - 1) / numberOfCollums);
          let y = (numberOfCell - 1) % numberOfCollums;
          return {x, y};
      }
  
      function resetGlobalPoints(){
          cellWithStartPoint = -1;
          cellWithEndPoint = -1;
          listOFBlockCells = []
      }
  
      function addNewBlockCellToArray(blockCell){
          listOFBlockCells.push(parseInt(blockCell));
      }
  
      function removeBlockCellFromArray(blockCell){
          const index = listOFBlockCells.indexOf(blockCell);
          listOFBlockCells.splice(index, 1);
      }
  
      function addNewBlock(obj){
          if(!isRoadBuilding){
              const newBlock = document.createElement("img");
              newBlock.src = document.getElementById("shield").src;  
              newBlock.class = shield
              newBlock.draggable = false;
              if(obj.childElementCount == 0){
                  obj.appendChild(newBlock)
                  addNewBlockCellToArray(obj.id);
                  if(isRoadActive)
                      removeRoads();
              }else if(obj.lastElementChild.class == "road"){
                  let child = obj.lastElementChild;
                  if(child != null){
                      obj.removeChild(child);
                      obj.appendChild(newBlock)
                      addNewBlockCellToArray(obj.id);
                      if(isRoadActive)
                          removeRoads();
                  }
              }
          }
      }

      function removeBlock(obj){
          if(!isRoadBuilding){
              let child = obj.lastElementChild;
              if(child != null && (child.class == "Papir" || child.class=="Olovo" || child.class=="Aluminijum")){
                  obj.removeChild(child);
                  removeBlockCellFromArray(parseInt(obj.id))
                  if(isRoadActive)
                      removeRoads();
              }
          }
      }
  
      function removeRoads(){
          isRoadActive = false;
          for(let i = 0; i < roads.length; ++i){
              let obj = document.getElementById(String(roads[i]));
              let child = obj.lastElementChild;
              if(child != null && child.class == "road")
                  obj.removeChild(child);
          }
          roads = [];
      }
  
      function setupOnClickForEachCell(table_id){
  
          document.getElementById("table-id").onmousedown = function() { 
              if(isBlockActive)
                  isMousePressedWithBlockActive = true;
              if(isEraserActive)
                  isMousePressedWithEraserActive = true;
          }
  
          document.body.onmouseup = function() {
              if(isBlockActive)
                  isMousePressedWithBlockActive = false;
              if(isEraserActive)
                  isMousePressedWithEraserActive = false;
          }
  
          let TABLE = document.getElementById(table_id);
          if (TABLE != null) {
              for (let i = 0; i < TABLE.rows.length; i++) {
                  for (let j = 0; j < TABLE.rows[i].cells.length; j++){
                      TABLE.rows[i].cells[j].ondrop = function(ev){
                          isMousePressedWithBlockActive = false;
                          isMousePressedWithEraserActive = false;
                          if(ev.target != null && ev.target.firstChild != null){

                          }
                      }
                      TABLE.rows[i].cells[j].firstChild.onmousedown = function () { 
                          if(isBlockActive)
                              addNewBlock(this);
                          if(isEraserActive)
                              removeBlock(this); 
                      };
  
                      TABLE.rows[i].cells[j].firstChild.onmouseover = function () { 
                          if(isBlockActive && isMousePressedWithBlockActive)
                              addNewBlock(this); 
                          if(isEraserActive && isMousePressedWithEraserActive)
                              removeBlock(this); 
                      };
                  }
              }
          }
      }

      function resetStartAndEndPoint(){
        let divForStartPoint = document.getElementById("source_div");
        let divForEndPoint = document.getElementById("detector_div");
        let existingStartPoint = document.getElementById("source");
        let existingEndPoint = document.getElementById("detector");
        divForStartPoint.appendChild(existingStartPoint);
        divForEndPoint.appendChild(existingEndPoint);
    }

      function activateBlock(){
          $('#shield_div').css("border", "3px solid #898373");
          isBlockActive = true;
      }
  
      function deactivateBlock(){
          if(isBlockActive){
              $('#shield_div').css("border", "3px solid #0157AE");
              isBlockActive = false;
              isMousePressedWithBlockActive = false;
          }
      }
  
      function activateEraser(){
          $('#eraser_div').css("border", "3px solid #898373");
          isEraserActive = true;
      }
  
      function deactivateEraser(){
          if(isEraserActive){
              $('#eraser_div').css("border", "3px solid #0157AE");
              isEraserActive = false;
              isMousePressedWithEraserActive = false;
          }
      }
  
      function recreateWholeTable(table_id){
           resetStartAndEndPoint();
           deactivateBlock();
           deactivateEraser();
          resetGlobalPoints();
           removeRoads();
  
          TABLE = $(table_id);
          TABLE_HTML = "<table>"
      
          let sizeOfCell = 42, addedBorder = 15;
          let num_cols = Math.floor(($(window).width() - addedBorder) / sizeOfCell);
          let num_rows = 14;
  
          numberOfCollums = num_cols;
          numberOfRows = num_rows
  
  
          let EMPTY_CELL_DIV_STRING_PART_1 = "<div ";
          let EMPTY_CELL_DIV_STRING_PART_2 =  " class=\"table-cell-div\" ondrop=\"drop(event)\" ondragover=\"allowDrop(event)\">"
  
          let cnt = 0;
          for (let i = 0; i < num_rows; i++){
              TABLE_HTML += "<tr>";
              for (let j = 0; j < num_cols; j++){
                  cnt++;
                  TABLE_HTML += "<td class=\"table-cell\">";
                  TABLE_HTML += EMPTY_CELL_DIV_STRING_PART_1;
                  TABLE_HTML += "id=\"" + String(cnt) + "\"";
                  TABLE_HTML += EMPTY_CELL_DIV_STRING_PART_2;
                  TABLE_HTML += "</div>";
                  TABLE_HTML += "</td>"
              }
              TABLE_HTML += "</tr>"
          }
          TABLE_HTML += "</table>"
          TABLE.html(TABLE_HTML);
          document.getElementById("distance").innerHTML = "Distanca: ";
          radiation=0;
          document.getElementById("radioactivity").innerHTML = "Radioaktivnost: ";
          setupOnClickForEachCell("table-id")
          clearInterval(interval)
      }

      //Checks if source directly aligned with detector
      let isNotified = false;
      let numShield = [];

      function calculateRadiation(){
        let startPoint = constructCords(cellWithStartPoint)
        let endPoint = constructCords(cellWithEndPoint)
        var isDetectingRadiation = true;
        if(isChanged){
            distance = Math.floor((Math.sqrt(Math.pow(endPoint.x-startPoint.x,2)+Math.pow(endPoint.y-startPoint.y,2)))*100)/100
            document.getElementById("distance").innerHTML = "Distanca: " + distance;
            numShield = findShields(startPoint,endPoint);
            isChanged=false;
        }

        if(endPoint.x!==startPoint.x){
            if(!isNotified){
            alert("Detektor detektuje samo snop iz izvora uperenog direktno ka njemu.");
            isNotified = true;
            }
            isDetectingRadiation = false;
            radiation=0;
        }

        let radiationPlace = document.getElementById("radioactivity");
        if(isDetectingRadiation){
            //Calculations 

            // linear coefficient of abosrbption
            // paper - 0.05cm-1 //random value
            // al - 0.136 cm−1
            // pb - 0.596 cm−1

            //Formula for calculating 
            //I = I0*e^-Md
            //I - intensity 
            //M - linear coefficient
            //d - distance
            var m = 0.1 + 0.05 * numShield[0] + 0.136 * numShield[1] + 0.596 * numShield[2];

            //Intensity of elements
            // plutonium - 5.156
            // strontium - 0.546
            // kobalt - 1.1732
            var intensity;
            if(sourceElement == "Plutonijum 239" ){
                intensity = 0.05156;
            }else if(sourceElement == "Strontium 90"){
                intensity = 5.46;
            } else{
                intensity = 117.32;
            }

            if((sourceElement == "Plutonijum 239" && numShield[0]>=1) || (sourceElement == "Strontium 90" && numShield[1]>=1)){
                radiation=0;
            }
            else {
                radiation = Math.floor(intensity*Math.E**(-1*m*distance)*100)/100            
                console.log(radiation + " = " + intensity + " "+ m + " " + distance)
                if (Math.random()>0.05){
                    radiation += 1
                }
            }

        }
        radiationPlace.innerHTML = "Radioaktivnost: " + radiation;
      }

      function findShields(startPoint, endPoint){
            let TABLE = document.getElementById('table-id');

            var numLe=0;
            var numAl=0;
            var numPa=0;
            
            console.log(startPoint.y + " " + endPoint.y)
            for(i=startPoint.y;i<endPoint.y ;++i){

                if(TABLE.rows[startPoint.x].cells[i].firstChild.firstChild!=null){
                    if(TABLE.rows[startPoint.x].cells[i].firstChild.firstChild.class==="Papir"){
                        numPa++;
                    }  else if(TABLE.rows[startPoint.x].cells[i].firstChild.firstChild.class==="Aluminijum"){
                        numAl++;
                    } else if(TABLE.rows[startPoint.x].cells[i].firstChild.firstChild.class==="Olovo"){
                        numLe++;
                    }
                }
                
            }
            
            return [numPa, numAl, numLe];
      }

      var interval;
      $('#start').click(function(evt){
        if(cellWithStartPoint != -1 && cellWithEndPoint != -1){
            console.log(sourceElement + " " + shield)
            interval = setInterval(calculateRadiation,1000);
        }
        else
            alert("Postavi izvor i detektor!");
        })

        $('#source_1').click(function(evt){
            sourceElement = "Plutonijum 239";
        })

        $('#source_2').click(function(evt){
            sourceElement = "Strontium 90";
        })

        $('#source_3').click(function(evt){
            sourceElement = "Kobalt 60";
        })

        $('#shield_1').click(function(evt){
            shield = "Papir";
            document.getElementById("shield").src="img\\paper.png"
        })

        $('#shield_2').click(function(evt){
            shield = "Aluminijum";
            document.getElementById("shield").src="img\\aluminium.png"
        })

        $('#shield_3').click(function(evt){
            shield = "Olovo";
            document.getElementById("shield").src="img\\lead.png"
        })


      $('#eraser_div').click(function(evt){  
          if(!isEraserActive){
              activateEraser();
              deactivateBlock()
          }else{
              deactivateEraser();
          }
      });
  
      $('#shield_div').click(function(evt){  
          if(!isBlockActive){
              activateBlock();
              deactivateEraser();
          }else{
              deactivateBlock();
          }
      });
  
      $(window).on("resize", function(){
          if(!isRoadBuilding)
              $(function(){recreateWholeTable("#table-id")});
      });
  
      var ignoreClickOnMeElement1 = document.getElementById('table-id');
      var ignoreClickOnMeElement2 = document.getElementById('shield_div');
      var ignoreClickOnMeElement3 = document.getElementById('eraser_div');
  
      document.addEventListener('mousedown', function(event) {
          var isClickInsideTable1 = ignoreClickOnMeElement1.contains(event.target);
          var isClickInsideTable2 = ignoreClickOnMeElement2.contains(event.target);
          var isClickInsideTable3 = ignoreClickOnMeElement3.contains(event.target);
          if (!isClickInsideTable1 && !isClickInsideTable2 && !isClickInsideTable3) {
              deactivateBlock();
              deactivateEraser();
          }
      });
      


      $(function(){recreateWholeTable("#table-id")});
  }
  let TABLE = table();