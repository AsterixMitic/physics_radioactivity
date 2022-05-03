function dropdownFunction(x) {
    document.getElementById(x).classList.toggle("show");
  }
  
  // Close the dropdown if the user clicks outside of it
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

let sourceElement = "Uranijum";
let shield = "Papir";
let particle = "Alfa";

  function allowDrop(ev) {
      ev.preventDefault();
  }
  function drag(ev) {
      ev.dataTransfer.setData("text", ev.target.id);
  }
    
  function drop(ev) {
      ev.preventDefault();
      if(!isRoadBuilding){
          let data = ev.dataTransfer.getData("text");
          if(ev.target.nodeName != 'IMG' && document.getElementById(data) != null){
              if(data == "source")
                  cellWithStartPoint = parseInt(ev.target.id);
              if(data == "detector")
                  cellWithEndPoint = parseInt(ev.target.id);
              ev.target.appendChild(document.getElementById(data));    
          }
      }
  }
  
  let table = () => {
      let isBlockActive = false;
      let isEraserActive = false;
      let isMousePressedWithBlockActive = false;
      let isMousePressedWithEraserActive = false;
      let numberOfCollums = 0;
      let numberOfRows = 0;
      let directions = [{x:0, y:-1}, {x:-1, y:0}, {x:0, y:1}, {x:1, y:0}];
      let isRoadActive = false;
      let roads = []
      let standbys = []
  
      function constructCords(numberOfCell){
          let x = Math.floor((numberOfCell - 1) / numberOfCollums);
          let y = (numberOfCell - 1) % numberOfCollums;
          return {x, y};
      }
  
      function deconstructCords(i, j){
          let ret = i * numberOfCollums + j + 1;
          return ret;
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
              newBlock.class = "block"
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
  
      function addNewRoad(i, j){
          const newRoad = document.createElement("img");
          newRoad.src = document.getElementById("shield").src;        
          newRoad.draggable = false;
          newRoad.class = "road"
          let obj = document.getElementById(String(deconstructCords(i, j)));
  
          if(obj.childElementCount == 0){
              obj.appendChild(newRoad)
          }
      }

      
      function removeBlock(obj){
          if(!isRoadBuilding){
              let child = obj.lastElementChild;
              if(child != null && child.class == "block"){
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
  
      function removeStandBys(){
          for(let i = 0; i < standbys.length; ++i){
              let obj = document.getElementById(String(standbys[i]));
              let child = obj.lastElementChild;
              if(child != null && child.class == "standby")
                  obj.removeChild(child);
          }
          standbys = []
      }
  
      function fill2DArray(array, value){
          for(let i = 0; i < numberOfRows; ++i){
              for(let j = 0; j < numberOfCollums; ++j){
                  array[i][j] = value;
              }
          }
      }
  
      function fill2DArrayForBlocks(array){
          for(let i = 0; i < numberOfRows; ++i){
              for(let j = 0; j < numberOfCollums; ++j){
                  array[i][j] = false;
              }
          }
  
          for(let i = 0; i < listOFBlockCells.length; ++i){
              let cords = constructCords(listOFBlockCells[i]);
              array[cords.x][cords.y] = true;
          }
      }
  
      function create2DArray(d1, d2) {
          var arr = new Array(d1), i, l;
          for(i = 0, l = d1; i < l; i++) {
              arr[i] = new Array(d2);
          }
          return arr;
      }
  
      function recursionForRoad(fi, fj, i, j, ei, ej, distance){
          if(fi == i && fj == j){
              isRoadBuilding = false;   
              return
          }
          if(i != ei || j != ej){
              addNewRoad(i, j);
              roads.push(deconstructCords(i, j))
          }
  
          setTimeout(() => {
              for(let ind = 0; ind < 4; ++ind){
                  let newI = i + directions[ind].x, newJ = j + directions[ind].y;
                  if(newI < 0 || newI >= numberOfRows || newJ < 0 || newJ >= numberOfCollums)
                      continue;
                  if(distance[newI][newJ] + 1 == distance[i][j]){
                      recursionForRoad(fi, fj, newI, newJ, ei, ej, distance);
                      return;
                  }                
              }
          }, 30);
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
          setupOnClickForEachCell("table-id")
      }
  
      $('#start').click(function(evt){
        if(cellWithStartPoint != -1 && cellWithEndPoint != -1){
            let startPoint = constructCords(cellWithStartPoint)
            let endPoint = constructCords(cellWithEndPoint)
            var distance = Math.floor((Math.sqrt(Math.pow(endPoint.x-startPoint.x,2)+Math.pow(endPoint.y-startPoint.y,2)))*100)/100
            document.getElementById("distance").innerHTML = "Distanca: " + distance;

            console.log(sourceElement + " " + shield + " " + particle)
        }
        else
            alert("Postavi izvor i detektor!");
})

        $('#source_1').click(function(evt){
            sourceElement = "Uranijum";
        })

        $('#source_2').click(function(evt){
            sourceElement = "Polonijum";
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

        $('#particle_1').click(function(evt){
            particle = "Alfa";
        })

        $('#particle_2').click(function(evt){
            particle = "Beta";
        })

        $('#particle_3').click(function(evt){
            particle = "Gama";
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
      var ignoreClickOnMeElement4 = document.getElementsByClassName('block');
      
  
      document.addEventListener('mousedown', function(event) {
          var isClickInsideTable1 = ignoreClickOnMeElement1.contains(event.target);
          var isClickInsideTable2 = ignoreClickOnMeElement2.contains(event.target);
          var isClickInsideTable3 = ignoreClickOnMeElement3.contains(event.target);
          //var isClickInsideTable4 = ignoreClickOnMeElement4.contains(event.target);
          if (!isClickInsideTable1 && !isClickInsideTable2 && !isClickInsideTable3 && !isClickInsideTable4) {
              deactivateBlock();
              deactivateEraser();
          }
      });
      
      $(function(){recreateWholeTable("#table-id")});
  }
  let TABLE = table();