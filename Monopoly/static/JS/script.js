const colors = ['orange','orangered','darkorange', 'gold', 'tomato', 'goldenrod','yellow'],
      fire_spread = 15 // best range 10-20

function addParticle() {
  var fs = document.createElement('div'),
      skew = Math.random() < .5 ? Math.random()*fire_spread : -Math.random()*fire_spread
  fs.className = 'fire_shaft'
  fs.style.height = Math.random()*50 + 25 + 'vh'
  fs.style.transform = 'skew('+skew+'deg)'
  fs.style.left = Math.random()*100 + '%'
  var p = document.createElement('div')
  p.className = 'particle'
  p.style.background = colors[Math.floor(Math.random()*colors.length)]
  p.onanimationend = function() { this.remove() }  
  document.body.appendChild(fs).appendChild(p)
}


$(".animacion_dinero").click(function() {
  $(".animacion_dinero").animate({bottom: 40, opacity: 1}, 900, "swing")
  $(".animacion_dinero").animate({bottom: 90, opacity: 0.1}, 800, "linear")
});


setInterval(addParticle,1000/60)


grid = document.getElementById("grid")
const cube1 = document.querySelector('.cube1');
const cube2 = document.querySelector('.cube2');
const time = 3;
const time2 = 3.5;
timeX = [time, time2]
cubeX = [cube1, cube2]


function mostrar_algo(){
  $.ajax({
    url:"/mostrar_algo",
    type:"GET",
    success: function(response){
      console.log(response["Partidas"][0][12])
    },
    error: function(error){
      console.log(error);
    }, 
  });
}

function mostrar_casillas_en_consola(){
  $.ajax({
    url:"/mostrar_casillas_en_consola",
    type:"GET",
    success: function(response){
      console.log(response)
    },
    error: function(error){
      console.log(error);
    }, 
  });
}

function mostrar_suerte_en_consola(){
  $.ajax({
    url:"/mostrar_suerte_en_consola",
    type:"GET",
    success: function(response){
      console.log(response)
    },
    error: function(error){
      console.log(error);
    }, 
  });
}



function empezar_partida(){
  $.ajax({
    url:"/empezar_partida",
    type: "GET",
    success:function(response){
      for(let i = 1; i <= parseInt(response); i++){
        
        i = String(i)
        ficha = document.createElement("div")
        ficha.classList.add("ficha"+ i)
        ficha.id = "ficha" + i
        grid.appendChild(ficha)
        
        ficha_falsa = "<div class='false_ficha"+i+"'></div>"
        $("#grid").append(ficha_falsa)
        fichaposicion1 = $("#ficha"+i).position()
        $(".false_ficha"+i).css({top: fichaposicion1["top"], left: fichaposicion1["left"]})
      }
      document.getElementById("btn_dados").hidden = false
      document.getElementById("cubo1").hidden = false
      document.getElementById("cubo2").hidden = false
      document.getElementById("contenedor_info_players").style.display = "flex"
      document.getElementById("botonesJuego").style.display = "flex"
      document.getElementById("pantalla_oscura").remove()
      document.getElementById("boton_empezar_partida").remove()
    },
    error: function(error){
      console.log(error)
    }
    
  })
  
}
















function tirar_dados(/*variable de player1*/){

  
  /*deshabilito el dado*/

  setTimeout(function(){
      $("#btn_pre_negociar").animate({left: 500}, "ease-in-out")
    }, 150);
  setTimeout(function(){
      $("#btn_construir").animate({left: 500}, "ease-in-out")
    }, 300);
  setTimeout(function(){
      $("#btn_demoler").animate({left: 500}, "ease-in-out")
    }, 450);
  document.getElementById("btn_dados").disabled = true
  document.getElementById("cubo1").disabled = true
  document.getElementById("cubo2").disabled = true
  document.getElementById("btn_pre_negociar").disabled = true
  document.getElementById("btn_construir").disabled = true
  document.getElementById("btn_demoler").disabled = true
  dado1 = 0
  dado2 = 0
  dadoX = [dado1, dado2]
  
  /*animacion del DADO y obtencion del numero*/
  for (let i = 0; i < 2; i++) {
    cubeX[i].style.transition = '';
      cubeX[i].style.transform = `translateY(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
      setTimeout(() => {
          cubeX[i].style.transition = `transform ${timeX[i]}s`;
          dadoX[i] = Math.floor((Math.random() * 6) + 1);
          switch(dadoX[i]) {
              case 1:cubeX[i].style.transform = `translateY(0px) rotateX(3600deg) rotateY(3600deg) rotateZ(3600deg)`;break;
              case 2:cubeX[i].style.transform = `translateY(0px) rotateX(4410deg) rotateY(3600deg) rotateZ(3600deg)`;break;
              case 3:cubeX[i].style.transform = `translateY(0px) rotateX(3600deg) rotateY(4410deg) rotateZ(3600deg)`;break;
              case 4:cubeX[i].style.transform = `translateY(0px) rotateX(3600deg) rotateY(2430deg) rotateZ(3600deg)`;break;
              case 5:cubeX[i].style.transform = `translateY(0px) rotateX(2430deg) rotateY(3600deg) rotateZ(3600deg)`;break;
              case 6:cubeX[i].style.transform = `translateY(0px) rotateX(3600deg) rotateY(1980deg) rotateZ(3600deg)`;break;
          };
      }, timeX[i] * 10);
  }
  

  
  /*empieza el contador de X segundos para volver a habilitar los dados*/
  setTimeout(function avanzar() {
    dado1 = dadoX[0]
    dado2 = dadoX[1]
    /*envio al pedido ajax el valor de un  dado y en response viene [dinero, total_dados, dado1, dado2, posicion, resul(* from Casillas)]*/
    total_dados = dado1 + dado2
    
    
    //esto pasa despues de que terminen de girar los dados
    $.ajax({
      url:"/tirar_dados",
      type: "POST",
      data:{"dado1": dado1, "dado2": dado2},
      success:function(response) {

        
        if (response[4] == "si") {
          
        }else if (response[4] == "no"){
//-------
          
          moverse("player" + String(response[0][2]), total_dados, response)
  
//----
          
          
        }
      },
      error:function(error){
        console.log(error)
      }
    })
    /*contador de dos segundos para mostrar la ficha1 original y esconder la falsa y para volver a habilitar el btn pasar turno*/
    setTimeout(function(){
      
      $(i_ficha).css("visibility", "visible")
      $(c_false_ficha).css("visibility", "hidden")
      if (dado1 == dado2) {
        document.getElementById("btn_dados").disabled = false
      }
    }, 2500);

  }, 4000);
}


function caer_en_casilla(response, nueva_posicion) {
  props = JSON.parse(response[0][12])
  if (props["player1"].hasOwnProperty(nueva_posicion+1) || props["player2"].hasOwnProperty(nueva_posicion+1) || props["player3"].hasOwnProperty(nueva_posicion+1) || props["player4"].hasOwnProperty(nueva_posicion+1)) {
    console.log("ya tiene dueño")
    /*tiene dueño*/
    for (let i = 1; i <= 4; i++) {
      if (props["player" + String(i)].hasOwnProperty(nueva_posicion+1)){
          precio = response[2][nueva_posicion][5+props[("player" + String(i))][(nueva_posicion+1)]]
          jug2 = "player" + String(i)
      }
    }
    jug1 = "player" + String(response[0][2])
    if (jug1 != jug2){
      cambio_dinero(jug1, -precio)
      cambio_dinero(jug2, precio)  
    }
    
    terminar()
  }
  else{
    /*no tiene dueño*/
    info_propiedad(response[2][nueva_posicion], response[0][2], response)
  }
}

/*
function moverse(player, cantidad, resp) {
  $.ajax({
    url:"/moverse",
    type:"POST",
    data:{"player":player, "cantidad": cantidad},
    success: function(response){    
      nueva_posicion= response[1][7+ parseInt(player.slice(-1))]
      c_false_ficha = ".false_ficha" + player.slice(-1)
      i_ficha = "#ficha" + player.slice(-1)
      ficha = document.getElementById("ficha" + player.slice(-1))
      $(c_false_ficha).css("visibility", "visible")
      $(i_ficha).css("visibility", "hidden")
      n = response[1][7+ parseInt(player.slice(-1))]   
      ficha1posicion1 = $(i_ficha).position()
      posicion_inicial = ficha.style.gridArea   
      if (n <= 10){
        ficha.style.gridArea = "11/" + (11-n) + "/12/" + (12-n)
      }
      if (n >= 11 && n <= 20){
        n -= 10
        ficha.style.gridArea= (11-n) + "/1/" + (12-n) + "/2"
      }
      if (n >= 21 && n <= 30){
        n -=20
        ficha.style.gridArea = "1/" + (1+n) + "/2/" + (2+n)
      }
      if (n >= 31 & n <= 39){
        n -=30
        ficha.style.gridArea = (1+n) + "/11/" + (2+n) + "/12"
      }    
      posicion_final = ficha.style.gridArea    
      fichaposicion2 = $(i_ficha).position()    
      if (posicion_inicial == "11 / 2 / 12 / 3" && posicion_final == "1 / 2 / 2 / 3"){
        $(c_false_ficha).animate({left: 50})
        $(c_false_ficha).animate({top: fichaposicion2["top"]})
        $(c_false_ficha).animate({left: fichaposicion2["left"]})
      }
      else if (posicion_inicial == "2 / 1 / 3 / 2" && posicion_final == "2 / 11 / 3 / 12"){
        $(c_false_ficha).animate({top: 50})
        $(c_false_ficha).animate({left: fichaposicion2["left"]})
        $(c_false_ficha).animate({top: fichaposicion2["top"]})
      }
      else if (posicion_inicial == "1 / 10 / 2 / 11" && posicion_final == "11 / 10 / 12 / 11"){
        $(c_false_ficha).animate({left: 700})
        $(c_false_ficha).animate({top: fichaposicion2["top"]})
        $(c_false_ficha).animate({left: fichaposicion2["left"]})
      }
      else if (posicion_inicial == "10 / 11 / 11 / 12" && posicion_final == "1 / 10 / 2 / 11"){
        $(c_false_ficha).animate({top: 700})
        $(c_false_ficha).animate({left: fichaposicion2["left"]})
        $(c_false_ficha).animate({top: fichaposicion2["top"]})
      }
      else if (posicion_inicial == "1 / 9 / 2 / 10" && posicion_final == "11 / 11 / 12 / 12"){
        $(c_false_ficha).animate({left: fichaposicion2["left"]})
        $(c_false_ficha).animate({top: fichaposicion2["top"]})
      }
      else if (posicion_inicial == "9 / 11 / 10 / 12" && posicion_final == "11 / 1 / 12 / 2"){
        $(c_false_ficha).animate({top: fichaposicion2["top"]})
        $(c_false_ficha).animate({left: fichaposicion2["left"]})
      }
      else if (posicion_inicial == "11 / 3 / 12 / 4" && posicion_final == "1 / 1 / 2 / 2"){
        $(c_false_ficha).animate({left: fichaposicion2["left"]})
        $(c_false_ficha).animate({top: fichaposicion2["top"]})
      }
      else if (posicion_inicial == "3 / 1 / 4 / 2" && posicion_final == "1 / 11 / 2 / 12"){
        $(c_false_ficha).animate({top: fichaposicion2["top"]})
        $(c_false_ficha).animate({left: fichaposicion2["left"]})
      }
      else if (posicion_final.slice(0,2) == "1 ") {
        $(c_false_ficha).animate({top: fichaposicion2["top"]})
        $(c_false_ficha).animate({left: fichaposicion2["left"]})
      }else if (posicion_final.slice(0,2) == "11") {
        $(c_false_ficha).animate({top: fichaposicion2["top"]})
        $(c_false_ficha).animate({left: fichaposicion2["left"]})
      }
      else{
        $(c_false_ficha).animate({left: fichaposicion2["left"]})
        $(c_false_ficha).animate({top: fichaposicion2["top"]})
      }
      caer_en_casilla(resp, nueva_posicion)
    },
    error: function(error){
      console.log(error);
    },
    
  });

}
*/

function moverse(player, cantidad, resp) {
  posicion_inicial = resp[1]
  p = document.createElement("p")
  p.classList.add("money")
  posicion_info_player=$(".info_player"+ player.slice(-1)).position()
  p.style.top = String(posicion_info_player["top"]+150)+"px"
  p.style.left = String(posicion_info_player["left"]+200)+ "px"
  p.innerHTML= "$"+ String(cantidad)
  document.getElementById("contenedor_info_players").appendChild(p)
  //ponerlo en el contenedor_info_players 
  $.ajax({
    url:"/moverse",
    type:"POST",
    data:{"player":player, "cantidad": cantidad},
    success: function(response){

      
      posicion_final= response[1][7+ parseInt(player.slice(-1))]
      
      console.log("Posicion Inicial:"+String(posicion_inicial))
      console.log("Posicion Final:" + String(posicion_final))


      
      c_false_ficha = ".false_ficha" + player.slice(-1)
      i_ficha = "#ficha" + player.slice(-1)
      ficha = document.getElementById("ficha" + player.slice(-1))
      $(c_false_ficha).css("visibility", "visible")
      $(i_ficha).css("visibility", "hidden")
      
      n = response[1][7+ parseInt(player.slice(-1))]
      
      fichacoords_inicial = $(i_ficha).position()
      ubicacion_inicial = ficha.style.gridArea
    
    
      /*posiciona a ficha en su posicion nueva segun n*/
      if (n <= 10){
        ficha.style.gridArea = "11/" + (11-n) + "/12/" + (12-n)
      }
      if (n >= 11 && n <= 20){
        n -= 10
        ficha.style.gridArea= (11-n) + "/1/" + (12-n) + "/2"
      }
      if (n >= 21 && n <= 30){
        n -=20
        ficha.style.gridArea = "1/" + (1+n) + "/2/" + (2+n)
      }
      if (n >= 31 & n <= 39){
        n -=30
        ficha.style.gridArea = (1+n) + "/11/" + (2+n) + "/12"
      }
    
      /*consigue posicion absoluta y gridArea finales de ficha1*/
      ubicacion_final = ficha.style.gridArea    
      fichacoords_final = $(i_ficha).position()
      /*crear los cuadrantes*/
      cuadrantes = {
      "uno": [0,1,2,3,4,5,6,7,8,9],
      "dos": [10,11,12,13,14,15,16,17,18,19],
      "tres": [20,21,22,23,24,25,26,27,28,29],
      "cuatro": [30,31,32,33,34,35,36,37,38,39]
    }
    //--------------------------------------------------------------------------------------------------------------------
  
      /*
      for (let i = 1; i < 5; i++) {
        n = i
        if (posicion_inicial in cuadrantes[String(n)]){
          if (posicion_inicial <= posicion_final) {
            if (posicion_final in cuadrantes[String(n)]) {//izquierda
              if(n%2==0){
                $(c_false_ficha).animate({top: fichacoords_final["top"]})
              }else if (n%2==1){
                $(c_false_ficha).animate({left: fichacoords_final["left"]})
              }
                
              if(n + 1 > 4){n =1}
            } else if (posicion_final in cuadrantes[String(n+1)]) {//izquierda arriba
              if(n%2==0){
                $(c_false_ficha).animate({top: 50})
                $(c_false_ficha).animate({left: fichacoords_final["left"]})
              }else if (n%2==1){
                $(c_false_ficha).animate({left: 50})
                $(c_false_ficha).animate({top: fichacoords_final["top"]})
              }
              if(n + 2 > 4){n =1}
            } else if (posicion_final in cuadrantes[String(n+2)]) {//izquierda arriba derecha
              if(n%2==0){
                $(c_false_ficha).animate({top: 50})
                $(c_false_ficha).animate({left: 50})
                $(c_false_ficha).animate({top: fichacoords_final["top"]})
              }else if (n%2==1){
                $(c_false_ficha).animate({left: 50})
                $(c_false_ficha).animate({top: 50})
                $(c_false_ficha).animate({left: fichacoords_final["left"]})
              }
              
              if(n + 3 > 4){n =1}
            } else if (posicion_final in cuadrantes[String(n+3)]) {//izquierda arriba derecha abajo
              if(n%2==0){
                $(c_false_ficha).animate({top: 50})
                $(c_false_ficha).animate({left: 50})
                $(c_false_ficha).animate({top: 700})
                $(c_false_ficha).animate({left: fichacoords_final["left"]})
              }else if (n%2==1){
                $(c_false_ficha).animate({left: 50})
                $(c_false_ficha).animate({top: 50})
                $(c_false_ficha).animate({left: 700})
                $(c_false_ficha).animate({top: fichacoords_final["top"]})
              }
              
            }
          } else {//da toda la vuelta
            if(n%2==0){
              $(c_false_ficha).animate({top: 50})
              $(c_false_ficha).animate({left: 50})
              $(c_false_ficha).animate({top: 700})
              $(c_false_ficha).animate({left: 700})
              $(c_false_ficha).animate({top: fichacoords_final["top"]})
            }else if (n%2==1){
              $(c_false_ficha).animate({left: 50})
              $(c_false_ficha).animate({top: 50})
              $(c_false_ficha).animate({left: 700})
              $(c_false_ficha).animate({top: 700})
              $(c_false_ficha).animate({left: fichacoords_final["left"]})
            }
          }
        }
      }
  Codigo que estuve a punto de hacer pero me falto la parte de hacer que segun un if mayor poder hacer que el if hijo tenga distintos condicionales que todos lleven a la misma rama de codigo =)
*/









      
      
      if (cuadrantes["uno"].includes(posicion_inicial)){
        if (posicion_inicial <= posicion_final) {
          console.log(posicion_final)
          console.log(cuadrantes["uno"])
          console.log(cuadrantes["dos"])
          if (cuadrantes["uno"].includes(posicion_final)) {//izquierda 
            console.log(fichacoords_final)
            $(c_false_ficha).animate({left: fichacoords_final["left"]})
          } else if (cuadrantes["dos"].includes(posicion_final)) {//izquierda
            $(c_false_ficha).animate({left: 26})
            $(c_false_ficha).animate({top: fichacoords_final["top"]})
          } else if (cuadrantes["tres"].includes(posicion_final)) {//izquierda arriba derecha
            $(c_false_ficha).animate({left: 26})
            $(c_false_ficha).animate({top: 26})
            $(c_false_ficha).animate({left: fichacoords_final["left"]})
          } else if (cuadrantes["cuatro"].includes(posicion_final)) {//izquierda arriba derecha abajo
            $(c_false_ficha).animate({left: 26})
            $(c_false_ficha).animate({top: 26})
            $(c_false_ficha).animate({left: 776})
            $(c_false_ficha).animate({top: fichacoords_final["top"]})
          } 
        } else {//da toda la vuelta
          $(c_false_ficha).animate({left: 26})
          $(c_false_ficha).animate({top: 26})
          $(c_false_ficha).animate({left: 776})
          $(c_false_ficha).animate({top: 776})
          $(c_false_ficha).animate({left: fichacoords_final["left"]})
        }
      



        
      }else if (cuadrantes["dos"].includes(posicion_inicial)) {
        if (posicion_inicial <= posicion_final || cuadrantes["uno"].includes(posicion_final)) {
          if (cuadrantes["dos"].includes(posicion_final)) {//arriba
            $(c_false_ficha).animate({top: fichacoords_final["top"]})
          } else if (cuadrantes["tres"].includes(posicion_final)) {//arriba derecha
            $(c_false_ficha).animate({top: 26})
            $(c_false_ficha).animate({left: fichacoords_final["left"]})
          } else if (cuadrantes["cuatro"].includes(posicion_final)) {//arriba derecha abajo
            $(c_false_ficha).animate({top: 26})
            $(c_false_ficha).animate({left: 776})
            $(c_false_ficha).animate({top: fichacoords_final["top"]})
          } else if (cuadrantes["uno"].includes(posicion_final)) {//arriba derecha abajo izquierda
            $(c_false_ficha).animate({top: 26})
            $(c_false_ficha).animate({left: 776})
            $(c_false_ficha).animate({top: 776})
            $(c_false_ficha).animate({left: fichacoords_final["left"]})
          } 
        } else {//da toda la vuelta
          $(c_false_ficha).animate({top: 26})
          $(c_false_ficha).animate({left: 26})
          $(c_false_ficha).animate({top: 776})
          $(c_false_ficha).animate({left: 776})
          $(c_false_ficha).animate({top: fichacoords_final["top"]})
        }
      }else if (cuadrantes["tres"].includes(posicion_inicial)) {
        if (posicion_inicial < posicion_final || cuadrantes["uno"].includes(posicion_final) || cuadrantes["dos"].includes(posicion_final)) {
          if (cuadrantes["tres"].includes(posicion_final)) {//derecha 
            $(c_false_ficha).animate({left: fichacoords_final["left"]})
          } else if (cuadrantes["cuatro"].includes(posicion_final)) {//derecha abajo
            $(c_false_ficha).animate({left: 776})
            $(c_false_ficha).animate({top: fichacoords_final["top"]})
          } else if (cuadrantes["uno"].includes(posicion_final)) {//derecha abajo izquierda
            $(c_false_ficha).animate({left: 776})
            $(c_false_ficha).animate({top: 776})
            $(c_false_ficha).animate({left: fichacoords_final["left"]})
          } else if (cuadrantes["dos"].includes(posicion_final)) {//derecha abajo izquierda arriba
            $(c_false_ficha).animate({left: 776})
            $(c_false_ficha).animate({top: 776})
            $(c_false_ficha).animate({left: 26})
            $(c_false_ficha).animate({top: fichacoords_final["top"]})
          } 
        } else {//da toda la vuelta
          $(c_false_ficha).animate({left: 776})
          $(c_false_ficha).animate({top: 776})
          $(c_false_ficha).animate({left: 26})
          $(c_false_ficha).animate({top: 26})
          $(c_false_ficha).animate({left: fichacoords_final["left"]})
        }
      }else if (cuadrantes["cuatro"].includes(posicion_inicial)) {
        if (posicion_inicial < posicion_final || cuadrantes["uno"].includes(posicion_final) || cuadrantes["dos"].includes(posicion_final)  || cuadrantes["tres"].includes(posicion_final)) {
          if (cuadrantes["cuatro"].includes(posicion_final)) {//abajo
            $(c_false_ficha).animate({top: fichacoords_final["top"]})
          } else if (cuadrantes["uno"].includes(posicion_final)) {//abajo izquierda
            $(c_false_ficha).animate({top: 776})
            $(c_false_ficha).animate({left: fichacoords_final["left"]})
          } else if (cuadrantes["dos"].includes(posicion_final)) {//abajo izquierda arriba
            
            $(c_false_ficha).animate({top: 776})
            $(c_false_ficha).animate({left: 26})
            $(c_false_ficha).animate({top: fichacoords_final["top"]})
          } else if (cuadrantes["tres"].includes(posicion_final)) {//abajo izquierda arriba derecha
            
            $(c_false_ficha).animate({top: 776})
            $(c_false_ficha).animate({left: 26})
            $(c_false_ficha).animate({top: 26})
            $(c_false_ficha).animate({left: fichacoords_final["left"]})
          } 
        } else {//da toda la vuelta
           $(c_false_ficha).animate({top: 776})
          $(c_false_ficha).animate({left: 26})
          $(c_false_ficha).animate({top: 26})
          $(c_false_ficha).animate({left: 776})
          $(c_false_ficha).animate({top: fichacoords_final["top"]})
        }
      }
//--------------------------------------------------------------------------------------------------------------------
      caer_en_casilla(resp, posicion_final)
    },
    error: function(error){
      console.log(error);
    },
  });
}






/*crea las cartas de propiedad */
function info_propiedad(propiedad, player, resp){
  console.log("kjs")
  f = propiedad
  setTimeout(function carta() {
    if (f[1] == "propiedad") {
      if (f[2] =="ferrocarril") {
        document.getElementById("carta_ferrocarril").hidden = false
        document.getElementById("nombre_ferrocarril").textContent = propiedad[3]
      } else if (f[2] =="compañia") {
        document.getElementById("carta_compañia").hidden = false
        document.getElementById("nombre_compañia").textContent = propiedad[3]
        if (propiedad[0] == 13) {
          document.getElementById("imagen_compañia").src ="/static/image/luz.png"
        }else{
          document.getElementById("imagen_compañia").src ="/static/image/agua.png"
        }
      }else{
        
        document.getElementById("carta_propiedad").hidden = false
        
        var lastClass = $('#carta_propiedad_color').attr('class').split(' ').pop();
        $('#carta_propiedad_color').removeClass(lastClass);
       
        document.getElementById("carta_propiedad_color").classList.add(propiedad[2])
        document.getElementById("nombre_propiedad").textContent = propiedad[3]
        document.getElementById("alquiler_propiedad").textContent = "ALQUILER $ "+String(propiedad[5])
        for (let i = 1; i <= 5; i++) {
          document.getElementById(String(i) + "_casa_propiedad").textContent = "$  " +String(propiedad[5 +i])
        }
        document.getElementById("hipoteca_propiedad").textContent = "$  " + String(propiedad[4]/2)
        document.getElementById("infoextra_propiedad").textContent = "Las casas cuestan $ "+String(propiedad[11])+" c/u. Los hoteles cuestan $ " + String(propiedad[11]) + ", más 4 casas."
      }
      document.getElementById("btns_compra_subasta").hidden = false
    }
      
    /*crea las cartas especiales cuando caes en una casilla especial*/
    else if(f[1] == "especial"){
      if (f[2] =="libre") {
            
        terminar()
      } else if (f[2] =="fortuna" || f[2] =="arca_comunal") {
        
        suerte(f[2], "player" + String(player), resp)


        
        



        
      } else if (f[2] =="policia") {
        policia(String(player))
      } else if (f[3]=="Impuestos"){
        cambio_dinero("player" + String(player), -resp[0][3 + resp[0][2]]*0.05)
        terminar()
      } else if (f[3]=="Impuestos sobre posesiones de lujo"){
        cambio_dinero("player" + String(player), -200)
        terminar()
      }
    }
  }, 1500);
}
function terminar() {
  setTimeout(function(){
      $("#btn_pre_negociar").animate({left: 70}, "ease-in-out")
    }, 150);
  setTimeout(function(){
      $("#btn_construir").animate({left: 70}, "ease-in-out")
    }, 300);
  setTimeout(function(){
      $("#btn_demoler").animate({left: 70}, "ease-in-out")
    }, 450);
  document.getElementById("btn_pre_negociar").disabled = false
  document.getElementById("btn_construir").disabled = false
  document.getElementById("btn_demoler").disabled = false
  document.getElementById("btn_pasar_turno").hidden = false
  document.getElementById("btn_pasar_turno").disabled = false
}
function pasar_carta() {
  document.querySelector(".carta").remove()
  document.getElementById("btn_pasar_carta").hidden = true
}

function suerte(tipo, player, resp) {
  $.ajax({
    url:"/suerte",
    type:"POST",
    data:{"tipo": tipo},
    success: function(response){

      carta_suerte = document.createElement("div")
      carta_suerte.classList.add("carta")
      carta_suerte.classList.add("carta_suerte")
      carta_suerte.id = "carta_suerte"
      if (tipo == "fortuna") {
        carta_suerte.innerHTML = "<h3>Fortuna</h3><p>"+ response[0][4]+"</p>"
      }else if (tipo == "arca_comunal") {
        carta_suerte.innerHTML = "<h3>Arca comunal</h3><p>"+ response[0][4]+"</p>"
      }
      grid.appendChild(carta_suerte)
      document.getElementById("btn_pasar_carta").hidden = false





      
      if (response[0][2]=="monto") {
        cambio_dinero(player, response[0][3])
        terminar()
      }else if (response[0][2]=="tp") {
        moverse(player, response[0][3] - response[1][7+parseInt(player.slice(-1))]-1, resp)
      }else if (response[0][2]=="viaje") {
        if (response[0][3]== "casillas") {
          moverse(player, -3, resp)
        }else{
          posibles_cercanos = JSON.parse(response[0][3])
          if (posibles_cercanos.find(element => element > response[1][7+parseInt(player.slice(-1))])) {
            mas_cercano = posibles_cercanos.find(element => element > response[1][7+parseInt(player.slice(-1))])
          }else{
            mas_cercano = posibles_cercanos[0]
          }
          moverse(player, mas_cercano-response[1][7+parseInt(player.slice(-1))]-1, resp)
        }
        
      }else if (response[0][2]=="viviendas") {
        


        
        propiedades = JSON.parse(response[1][12])
        keys_propiedades = Object.keys(propiedades[player])

        if (keys_propiedades.length != 0) {
          alquileres=0
          for (let i = 0; i < keys_propiedades.length; i++) {
            if (propiedades[player][keys_propiedades[i]] == 5) {
              alquileres += parseInt(response[0][3].slice(-3))
            }else if(propiedades[player][keys_propiedades[i]] <=4 && keys_propiedades[i]>0){
              alquileres += parseInt(response[0][3].slice(0, 2))*propiedades[player][keys_propiedades[i]]
            }
          }
          cambio_dinero(player, alquileres)
        }else{
            console.log("vacio")
        }
        terminar()
      }
      
      
    },
    error: function(error){
      console.log(error);
    }, 
  });

}






function policia(objetivo){
  c_false_ficha =".false_ficha" + objetivo
  i_ficha = "#ficha" + objetivo
  ficha = document.getElementById("ficha" + objetivo)
    
  ficha.style.gridArea = "11/1/12/2"
  $.ajax({
    url:"/carcel",
    type:"GET",
    success: function(respons){
      fichaposicion2 = $(i_ficha).position()
      $(c_false_ficha).animate({left: fichaposicion2["left"]})
      $(c_false_ficha).animate({top: fichaposicion2["top"]})
      terminar()
    },
    error: function(error){
      console.log(error);
    }, 
  });
}


function comprar(){
  $.ajax({
    url:"/comprar",
    type:"GET",
    success: function(response){
      if (document.getElementById("carta_propiedad").hidden == false) {
        document.getElementById("carta_propiedad").hidden = true
        
      } else if(document.getElementById("carta_ferrocarril").hidden == false){
        document.getElementById("carta_ferrocarril").hidden = true
      }else if (document.getElementById("carta_compañia").hidden == false){
        document.getElementById("carta_compañia").hidden = true
      }
      player = "player" + String(response[0][2])
      idprop = parseInt(response[0][7 + parseInt(response[0][2])]) + 1
      
      cambio_dinero(player, -response[1][idprop-1][4])
      adquirirPropiedad(idprop, player)

      
      document.getElementById("btns_compra_subasta").hidden = true
      terminar()
    },
    error: function(error){
      console.log(error);
    }
  });
}


function subastar(){
  $.ajax({
    url:"/subasta",
    type:"GET",
    success: function(response){
      if (document.getElementById("carta_propiedad").hidden == false) {
        document.getElementById("carta_propiedad").hidden = true
      } else if (document.getElementById("carta_compañia").hidden == false) {
        document.getElementById("carta_compañia").hidden = true
      } else if (document.getElementById("carta_ferrocarril").hidden == false) {
        document.getElementById("carta_ferrocarril").hidden = true
      }
      
      console.log(response)
      document.getElementById("subasta").hidden = false
      document.getElementById("btns_compra_subasta").hidden = true
      $("#subasta_propiedad_nombre").html(response[2][3])
      $("#subasta_jugador").html("Player " + response[0][2])
      $("#abandonar_subasta").attr("onclick", "abandonar_subasta("+ response[2][0]+")")



      
    },
    error: function(error){
      console.log(error);
    }
  });
}

function subir_subasta(){
  input = $("#input_subasta").val()
  ul = document.getElementById("ul_subasta")
  li = document.createElement("li")
  li.classList.add("li_subasta")
  
  $.ajax({
    url:"/subir_subasta",
    data:{"input": input},
    type:"POST",
    success: function(response){

      
      if (response[3] == "bien") {
        
        document.getElementById("subasta_jugador").textContent = "Player " + String(response[0]["actual"])
        li.textContent = "Player " + String(response[1]) + " --- $" + response[2]
        ul.appendChild(li)
      
      }else if(response[3] == "invalido"){
        console.log("El valor debe ser mayor a 0 y tienes que poder pagarlo")
      }else if(response[3] == "casivalido"){
        console.log("Lo mínimo que puedes aumentar es $10")
      }else if(response[3] == "menor"){
        console.log("Tu apuesta debe ser mayor que a la de los demás jugadores")
      }
      document.getElementById("input_subasta").value =""
    
    
    },
    error: function(error){
      console.log(error);
    }
  })
}
function abandonar_subasta(idpropiedad) {
  ul = document.getElementById("ul_subasta")
  li = document.createElement("li")
  li.classList.add("li_subasta")
  
   $.ajax({
    url:"/abandonar_subasta",
    type:"POST",
    success: function(response){
      document.getElementById("input_subasta").value =""
      document.getElementById("subasta_jugador").textContent = "Player " + String(response[3])
      li.textContent = "Player " + String(response[2]) + " ha abandonado la subasta"
      ul.appendChild(li)
      if (response[1]== "termina") {

        document.getElementById("subasta").hidden = true
        cambio_dinero("player" + String(response[3]), -response[4])
        adquirirPropiedad(idpropiedad, "player"+String(response[3]))
        terminar()
      }
      
    
    
    
    
    
    
    
    },
    error: function(error){
      console.log(error);
    }
    
  });
}

function adquirirPropiedad(idprop, player){
  $.ajax({
    url:"/adquirirPropiedad",
    type:"POST",
    data: {"idprop": idprop, "player": player},
    success: function(response){
      /*
-webkit-box-shadow: inset 0px -200px 30px -195px rgba(0,0,255,1);
-moz-box-shadow: inset 0px -200px 30px -195px rgba(0,0,255,1);
box-shadow: inset 0px -200px 30px -195px rgba(0,0,255,1);
*/    div = document.createElement("div")
      idelem = document.getElementById("div" + String(idprop))
      div.classList.add("dueño" + player)
      idelem.appendChild(div)
    
    
    
    
    
    
    
    },
    error: function(error){
      console.log(error);
    }
    
  });
  
}
/*
function pagar(persona1, persona2, monto){

  $.ajax({
    url:"/pagar",
    type: "POST",
    data:{"persona1": persona1, "persona2": persona2, "monto": monto},
    success: function(response) {
      id = "dinero_" + response[1]
      document.getElementById(id).textContent = response[0][3 + parseInt(response[1].charAt(response[1].length -1))]
      id2 = "dinero_" + response[2]
      document.getElementById(id2).textContent = response[0][3 + parseInt(response[2].charAt(response[2].length -1))]
    },
    error: function(error){
      console.log(error)
    }
  })
}*/

function funcion_rivas(tipo) {
  console.log(tipo)
  $.ajax({
    url:"/funcion_rivas",
    type:"POST",
    data:{"tipo":tipo},
    success:function(response){
      console.log(response)
      if (tipo=="hipotecar") {
        for (let i = 0; i < response[1].length; i++) {
          if (response[1][i] ==0) {
            btn = document.createElement("button")
            btn.classList.add("btn_hipotecar")
            btn.id="btn_hipotecar"
            casilla=document.getElementById("div"+String(response[1][i]))
            casilla.appendChild(div)  
          }
        }  
      }else if (tipo=="redimir") {
        for (let i = 0; i < response[1].length; i++) {
          if (response[1][i] ==-1) {
            btn = document.createElement("button")
            btn.classList.add("btn_redimir")
            btn.id="btn_redimir"
            casilla=document.getElementById("div"+String(response[1][i]))
            casilla.appendChild(div)  
          }
        }
      }
    },
    error:function(error){
      console.log(error)
    }
  })
}

function atras_funcion_rivas() {
  console.log("atras_funcion_rivas")
}

function cambio_dinero(persona, monto) {
  $.ajax({
    url:"/cambio_dinero",
    type: "POST",
    data:{"persona": persona, "monto": monto},
    success: function(response) {
      console.log(response[2] + " " + response[3]) 
      $("#dinero_player"+persona.slice(-1)).html("$ "+String(response[1][3+parseInt(persona.slice(-1))]))
    },
    error: function(error){
      console.log(error)
    }
  })
}

function pre_negociar() {
  $.ajax({
      url:"/pre_negociar",
      type:"GET",
      success:function(response){
        $("#btn_pre_negociar").attr("onclick", "atras_pre_negociar()")
        $("#btn_pre_negociar").html("Atrás")
        $("#contenedor_negociacion").css("display", "flex")





        select_valor = "player" + String(response[0][2])
        document.getElementById("nombre_persona1").textContent = select_valor
        document.getElementById("dinero_persona1").textContent = response[0][3+parseInt(select_valor.slice(-1))]
        $(".option_propiedad_negociacion_persona1").remove()
        for (let i = 0; i < Object.keys(JSON.parse(response[0][12])[select_valor]).length; i++) {
          option = document.createElement("option")
          option.value = String(response[1][parseInt(Object.keys(JSON.parse(response[0][12])[select_valor])[i])-1][0])
          option.classList.add("option_propiedad_negociacion_persona1")
          option.text = response[1][parseInt(Object.keys(JSON.parse(response[0][12])[select_valor])[i])-1][3]
          select = document.getElementById("select_propiedades_negociacion_persona1")
          select.appendChild(option)
        }

        $(".option_player_negociacion").remove()
        for (let i = 1; i <= response[0][3]; i++) {
          if (i != response[0][2]) {
            option =  document.createElement("option")
            option.value = "player" + String(i)
            option.classList.add("option_player_negociacion")
            option.text = "Player " + String(i)  
            select = document.getElementById("select_player_negociacion")
            select.appendChild(option)
          }
        }
        

      },
      error:function(error){
        console.log(error)
      }
    })
}

$("#select_player_negociacion").change(function() {

  $.ajax({
      url:"/selector_negociar",
      type:"GET",
      success:function(response){
        select_valor = document.getElementById("select_player_negociacion").value
        if (select_valor != "-----") {
          document.getElementById("nombre_persona2").textContent = select_valor
          document.getElementById("dinero_persona2").textContent = response[0][3+parseInt(select_valor.slice(-1))]
          $(".option_propiedad_negociacion_persona2").remove()
          for (let i = 0; i < Object.keys(JSON.parse(response[0][12])[select_valor]).length; i++) {
            option = document.createElement("option")
            option.value = String(response[1][parseInt(Object.keys(JSON.parse(response[0][12])[select_valor])[i])-1][0])
            option.classList.add("option_propiedad_negociacion_persona2")
            option.text = response[1][parseInt(Object.keys(JSON.parse(response[0][12])[select_valor])[i])-1][3]
            select = document.getElementById("select_propiedades_negociacion_persona2")
            select.appendChild(option)
          }
        }
      },
      error:function(error){
        console.log(error)
      }
    })
})




function atras_pre_negociar() {
  $("#btn_pre_negociar").attr("onclick", "pre_negociar()")
  $("#btn_pre_negociar").html("Negociar")
  $("#contenedor_negociacion").css("display", "none")
}

function negociar() {
  if (document.querySelector(".carta") == null){
    persona2 = document.getElementById("select_player_negociacion").value
    propiedad_persona1 = document.getElementById("select_propiedades_negociacion_persona1").value
    monto_persona1 = document.getElementById("input_dinero_negociacion_persona1").value
    propiedad_persona2 = document.getElementById("select_propiedades_negociacion_persona2").value
    monto_persona2 = document.getElementById("input_dinero_negociacion_persona2").value
    
    if (persona2 != "-----") {
      if(monto_persona1 == 0 && propiedad_persona1 == "-----"){
        alert("Debes ofrecer algo a cambio")
      }else if (monto_persona2 == 0 && propiedad_persona2 == "-----"){
        alert("Debes pedir algo a cambio")
      }else{
        $.ajax({
          url:"/montopersonas",
          type:"GET",
          success: function(response){


            if (monto_persona1%1 != 0 || monto_persona1 >= response[0][3+response[0][2]] || monto_persona1 < 0) {
              alert("El monto del jugador "+ String(response[0][2]) +" es inválido")
            }else if (monto_persona2%1 != 0 || monto_persona2 >= response[0][3+parseInt(persona2.slice(-1))] || monto_persona2 < 0){
              alert("El monto del jugador "+persona2.slice(-1)+" es inválido")
            }else{
              document.getElementById("input_dinero_negociacion_persona1").disabled = true
              document.getElementById("select_propiedades_negociacion_persona1").disabled = true
              document.getElementById("select_player_negociacion").disabled = true
              document.getElementById("input_dinero_negociacion_persona2").disabled = true
              document.getElementById("select_propiedades_negociacion_persona2").disabled = true
              document.getElementById("btn_negociacion").disabled = true
              document.getElementById("btn_aceptar_trato").hidden = false
              document.getElementById("btn_negar_trato").hidden = false
            }
            

            
          },
          error: function(error){
            console.log(error);
          }
        });

        
        







        
      }
    }else{
    alert("Ingrese con que jugador desea negociar")
    }
  }
}


function aceptar_trato(){
  monto_persona1 = document.getElementById("input_dinero_negociacion_persona1").value
  propiedad_persona1 = document.getElementById("select_propiedades_negociacion_persona1").value
  monto_persona2 = document.getElementById("input_dinero_negociacion_persona2").value
  propiedad_persona2 = document.getElementById("select_propiedades_negociacion_persona2").value
  persona2 = document.getElementById("select_player_negociacion").value
  $.ajax({
    url:"/aceptar_trato",
    type:"POST",
    data: {"value1":monto_persona1, "value2":propiedad_persona1,"value3":monto_persona2, "value4":propiedad_persona2,"value5":persona2},
    success: function(response){
    },
    error: function(error){
      console.log(error);
    }
  });
  negar_trato()
  $("#contenedor_negociacion").css("display", "none")
  $("#btn_pre_negociar").attr("onclick", "pre_negociar()")
  $("#btn_pre_negociar").html("Negociar")
}

function negar_trato(){
  document.getElementById("input_dinero_negociacion_persona1").disabled = false
  document.getElementById("select_propiedades_negociacion_persona1").disabled = false
  document.getElementById("select_player_negociacion").disabled = false
  document.getElementById("input_dinero_negociacion_persona2").disabled = false
  document.getElementById("select_propiedades_negociacion_persona2").disabled = false
  document.getElementById("btn_negociacion").disabled = false
  document.getElementById("btn_aceptar_trato").hidden = true
  document.getElementById("btn_negar_trato").hidden = true
}


function construir(tipo) {
if(tipo=="vender")
  $("#btn_demoler").attr("onclick", "atras_construir()")
else if(tipo=="comprar"){
  $("#btn_construir").attr("onclick", "atras_construir()")
}
  

  if (document.querySelector(".carta") == null){
    $.ajax({
      url:"/construir",
      type:"GET",
      success:function(response){
        for (let i = 0; i < 28; i++) {
          if (document.querySelector(".btn_casa") != null){
            document.querySelector(".btn_casa").remove()
          }
        }
        for (let i = 0; i < response[1].length; i++) {
          
          if (response[2].hasOwnProperty(String(i))){
            if (response[3].includes(response[1][parseInt(i-1)][2])) {
              response[3][response[1][parseInt(i-1)][0]-1] = ""
            }
          }
        }
        for (let i = 0; i < response[1].length; i++) {
          if (response[2].hasOwnProperty(String(i))){
            if (response[3].includes(response[1][parseInt(i-1)][2]) == false && ((response[2][String(i)]!= 5 && tipo == "comprar") || (response[2][String(i)]>=1 && tipo == "vender"))) {
              div_comprar = document.createElement("button")
              id = "div_comprar" + String(i)
              div_comprar.id = id
              div_comprar.classList.add("btn_casa")
              div_comprar.classList.add("btn_" + tipo)
              id_div = "div" + i
              document.getElementById(id_div).appendChild(div_comprar)
              id = "#" + id
              fnc = "modif_casa('"  + tipo +"', '" + String(i) + "')"
              $(id).attr("onclick", fnc)
            }
          }
        }
      },
      error:function(error){
        console.log(error)
      }
    })
  }
}
function atras_construir() {
  for (let i = 0; i < 28; i++) {
    if (document.querySelector(".btn_casa") != null){
      document.querySelector(".btn_casa").remove()
    }
  }
}

function modif_casa(tipo, id_propiedad){
  
  $.ajax({
    url:"/modif_casa",
    type:"POST",
    data: {"value1":tipo, "value2":id_propiedad},
    success: function(response){
      res = JSON.parse(response[0])
      if (tipo =="comprar") {
        if (res["player"+response[1]][String(id_propiedad)]!=5) {
          //agregar casa
          nueva_casa = document.createElement("img")
          nueva_casa.src="/static/image/casa.png"
          nueva_casa.classList.add("casita")
          div_casas = document.getElementById("div_casa"+ String(id_propiedad))
          div_casas.appendChild(nueva_casa)
        }else{
          //sacar casas y agregar hotel
          document.getElementById("div_comprar"+String(id_propiedad)).remove()
          div_casas = document.getElementById("div_casa"+ String(id_propiedad))
          div_casas.innerHTML =""
          nuevo_hotel = document.createElement("img")
          nuevo_hotel.classList.add("hotel")
          nuevo_hotel.src="/static/image/hotel.png"
          div_casas.appendChild(nuevo_hotel)
        }
        cambio_dinero("player"+response[1], -response[2][id_propiedad-1][11])  
      }else if (tipo =="vender") {

        if (res["player"+response[1]][String(id_propiedad)]==4) {
          //sacar hotel y poner 4 casas
          div_casas = document.getElementById("div_casa"+ String(id_propiedad))
          div_casas.innerHTML =""
          for (let i = 1; i <= 4; i++) {
            nueva_casa = document.createElement("img")
            nueva_casa.src="/static/image/casa.png"
            nueva_casa.classList.add("casita")
            div_casas = document.getElementById("div_casa"+ String(id_propiedad))
            div_casas.appendChild(nueva_casa)
          }
        }else if (res["player"+response[1]][String(id_propiedad)]==0) {
          //sacar casa y eliminar boton
          document.querySelector(".casita").remove()
          document.getElementById("div_comprar"+String(id_propiedad)).remove()
        }else{
          //sacar casa
          document.querySelector(".casita").remove()
        }
        cambio_dinero("player"+response[1], response[2][id_propiedad-1][11]/2)  
      }
      
    },
    error: function(error){
      console.log(error);
    }
  });
  
}



function adquirir_monopolio() {
  adquirirPropiedad(17, "player2")
  setTimeout(function () {
   adquirirPropiedad(19, "player2")
  }, 0300);
  setTimeout(function () {
   adquirirPropiedad(20, "player2")
  }, 0600);
}



function pasar_turno(){
  if (document.querySelector(".carta") == null){
    setTimeout(function psr_trn() {
  
      $.ajax({
        url:"/pasar_turno",
        type:"GET",
        success: function(response){
          console.log(response[0] + " ---> " +response[1])
          if (response[3] != 0){//if de si se elimino algun player
            //borrar todos los elementos del player eliminado (propiedades, ficha, no se que mas)
            $(".dueñoplayer" + String(response[3])).removeClass("dueñoplayer" + String(response[3]))
            $("#ficha" + String(response[3])).remove()
            $(".false_ficha" + String(response[3])).remove()
          }
        },
        error: function(error){
          console.log(error);
        }
      });
    }, 0100);
    
    document.getElementById("btn_dados").disabled = false
    document.getElementById("btn_pasar_turno").disabled = true
    document.getElementById("btn_pasar_turno").hidden = true
    
  }
  
}

function bancarrota_prueba(){
  cambio_dinero("player1", -6000)
}
/* 
e = sqlite3.connect('database.db')
  q = f"""INSERT INTO preguntas(pregunta, respuesta) VALUES ('{search_term}', '{search_term2}')"""
  e.execute(q)
  e.commit()
  e.close()
  
  
  conn = sqlite3.connect('database.db')
  resu = conn.execute(f"""SELECT * FROM preguntas""")
  resul = resu.fetchall()
  conn.close()
  
  
  $.ajax({
    url:"/boton2",
    type:"POST",
    data: {"value":nuevaPregunta, "value2": nuevaRespuesta},
    success: function(response){
      console.log(true)
      alert("Pregunta ingresada correctamente")
    },
    error: function(error){
      console.log(error);
    }, 
  });
  
  */

