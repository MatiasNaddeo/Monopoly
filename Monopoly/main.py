from flask import Flask, render_template, request, session, redirect, url_for, jsonify, json
import sqlite3
import random

app = Flask(__name__)
app.secret_key = "clave"


@app.route('/')
def index():
    return render_template("index.html")

@app.route('/mostrar_algo', methods=["GET"])
def mostrar_algo():
  conn = sqlite3.connect('monopoly.db')
  resu1 = conn.execute(f"""SELECT * FROM Suerte""")
  resul1 = resu1.fetchall()
  conn.close()
  conn = sqlite3.connect('monopoly.db')
  resu2 = conn.execute(f"""SELECT * FROM Casillas""")
  resul2 = resu2.fetchall()
  conn.close()
  conn = sqlite3.connect('monopoly.db')
  resu3 = conn.execute(f"""SELECT * FROM Partidas""")
  resul3 = resu3.fetchall()
  conn.close()
  conn = sqlite3.connect('monopoly.db')
  resu4 = conn.execute(f"""SELECT * FROM Perfil""")
  resul4 = resu4.fetchall()
  conn.close()
  return {"Suerte":resul1, "Casillas":resul2, "Partidas":resul3, "Perfil":resul4}

  
@app.route('/index_salir')
def index_salir():
    session.clear()
    return redirect(url_for('index'))


@app.route('/login', methods=['POST'])
def login():
    nombre = request.form["name"]
    contraseña = request.form["password"]
    if nombre == "" or contraseña == "":
      return redirect(url_for("ingresar"))
    conn = sqlite3.connect('monopoly.db')
    resu = conn.execute(f"""SELECT * FROM Perfil""")
    resul = resu.fetchall()
    conn.close()
    if nombre == resul[0][1] and contraseña == resul[0][2]:
        session["nombre"] = nombre
        return redirect(url_for('admin'))
    else:
        for i in range(len(resul)):
            if nombre == resul[i][1] and contraseña == resul[i][2]:
                session["nombre"] = nombre
                return redirect(url_for('lobby'))
        else:
            return redirect(url_for('ingresar'))


@app.route('/mostrar_casillas_en_consola')
def mostrar_casillas_en_consola():
    conn = sqlite3.connect('monopoly.db')
    resu = conn.execute(f"""SELECT * FROM Casillas""")
    resul = resu.fetchall()
    conn.close()
    return resul
  
@app.route('/mostrar_suerte_en_consola')
def mostrar_suerte_en_consola():
    conn = sqlite3.connect('monopoly.db')
    resu = conn.execute(f"""SELECT * FROM Suerte""")
    resul = resu.fetchall()
    conn.close()
    return resul

@app.route('/ingresar_casillas_admin', methods=["POST"])
def ingresar_casillas_admin():
    select_casilla = request.form['select_casilla']
    tipo = request.form['tipo']
    subtipo = request.form['subtipo']
    nombre = request.form['nombre']
    e = sqlite3.connect('monopoly.db')
    q = f"""UPDATE Casillas SET tipo = '{tipo}', subtipo = '{subtipo}', nombre = '{nombre}' WHERE id = '{select_casilla}'"""
    e.execute(q)
    e.commit()
    e.close()
    if request.form["precio"] != "" and request.form["alquiler"] != "":
        precio = request.form['precio']
        alquiler = request.form['alquiler']
        e = sqlite3.connect('monopoly.db')
        q = f"""UPDATE Casillas SET precio = '{precio}', alquiler = '{alquiler}' WHERE id = '{select_casilla}'"""
        e.execute(q)
        e.commit()
        e.close()
    if request.form["1_casa$"] != "" and request.form[
            "2_casa$"] != "" and request.form["3_casa$"] != "" and request.form[
                "4_casa$"] != "" and request.form["hotel$"] != "":
        unacasa = request.form['1_casa$']
        doscasa = request.form['2_casa$']
        trescasa = request.form['3_casa$']
        cuatrocasa = request.form['4_casa$']
        hotel = request.form['hotel$']
        e = sqlite3.connect('monopoly.db')
        q = f"""UPDATE Casillas SET unacasa = '{unacasa}', doscasa = '{doscasa}', trescasa = '{trescasa}', cuatrocasa = '{cuatrocasa}', hotel = '{hotel}' WHERE id = '{select_casilla}'"""
        e.execute(q)
        e.commit()
        e.close()
    return redirect(url_for('admin'))

  
@app.route('/ingresar_suerte_admin', methods = ["POST"])
def ingresar_suerte_admin():
  tipo = request.form["tipo"]
  contenido = request.form["contenido"]
  e = sqlite3.connect('monopoly.db')
  q = f"""INSERT INTO Suerte (tipo, contenido) VALUES ('{tipo}', '{contenido}'); """
  e.execute(q)
  e.commit()
  e.close()
  return redirect(url_for('admin'))

@app.route('/eliminar_suerte_admin', methods = ["POST"])
def eliminar_suerte_admin():
  select_cartas = request.form["select_cartas"]
  e = sqlite3.connect('monopoly.db')
  q = f"""DELETE FROM Suerte WHERE id = '{select_cartas}'"""
  e.execute(q)
  e.commit()
  e.close()
  return redirect(url_for('admin'))

@app.route('/crear_cuenta', methods=['POST'])
def crear_cuenta():
    nombre = request.form["name"]
    contraseña = request.form["password"]
    conn = sqlite3.connect('monopoly.db')
    resu = conn.execute(f"""SELECT * FROM Perfil""")
    resul = resu.fetchall()
    conn.close()
    for i in range(len(resul)):
        if nombre == resul[i][1]:
            return redirect(url_for('registrarse'))
    else:
        e = sqlite3.connect('monopoly.db')
        q = f"""INSERT INTO Perfil(nick, contraseña) VALUES ('{nombre}', '{contraseña}')"""
        e.execute(q)
        e.commit()
        e.close()
        session["nombre"] = nombre
        return redirect(url_for('lobby'))


@app.route('/registrarse')
def registrarse():
    return render_template("registrarse.html")


@app.route('/ingresar')
def ingresar():
    return render_template("ingresar.html")


@app.route('/admin')
def admin():
    conn = sqlite3.connect('monopoly.db')
    resu = conn.execute(f"""SELECT * FROM Casillas""")
    resul = resu.fetchall()
    conn.close()
    conn2 = sqlite3.connect('monopoly.db')
    resu2 = conn2.execute(f"""SELECT * FROM Suerte""")
    resul2 = resu2.fetchall()
    conn2.close()
    return render_template("admin.html", resul=resul, resul2 = resul2, resul2len = len(resul2))


@app.route('/lobby')
def lobby():
    return render_template("lobby.html")


@app.route('/lobby_atras')
def lobby_atras():
    session.pop("partida", None)
    session.pop("player1", None)
    session.pop("player2", None)
    session.pop("player3", None)
    session.pop("player4", None)
    g = sqlite3.connect("monopoly.db")
    f = f"""DELETE FROM Partidas WHERE anfitrion = '{session["nombre"]}'"""
    g.execute(f)
    g.commit()
    g.close()
    return redirect(url_for('lobby'))


@app.route('/juego<cant_players>', methods=['GET'])
def juego(cant_players):  #pasar un valor a juego(valor) desde lobby.html (cantidad de jugadores)
    g = sqlite3.connect("monopoly.db")
    f = f"""DELETE FROM Partidas WHERE anfitrion = '{session["nombre"]}'"""
    g.execute(f)
    g.commit()
    g.close()
    propiedades = json.dumps({
      "player1": {},
      "player2": {},
      "player3": {},
      "player4": {},
    })
    prision = json.dumps({})
    subasta = json.dumps({})
    e = sqlite3.connect('monopoly.db')
    q = f"""INSERT INTO Partidas(anfitrion, turno, cantidadjugadores, propiedades, prision, subasta) VALUES ('{session["nombre"]}', '{1}', '{cant_players}', '{propiedades}', '{prision}', '{subasta}')"""
    e.execute(q)

    for a in range(int(cant_players)):

      w = f"""UPDATE Partidas SET jugador{a+1}dinero = '{5000}', jugador{a+1}posicion = '{0}' WHERE anfitrion = '{session["nombre"]}'"""
      e.execute(w)
    e.commit()
    e.close()
  
    dbpartida = dbPartida()
    
    dinero = [dbpartida[4], dbpartida[5], dbpartida[6], dbpartida[7]]
    posicion = [dbpartida[8], dbpartida[9], dbpartida[10], dbpartida[11]]



    conn = sqlite3.connect('monopoly.db')
    resu = conn.execute(f"""SELECT * FROM Casillas""")
    resul = resu.fetchall()
    conn.close()
  
    return render_template("juego.html",
                           resul=resul,
                           nombre=session["nombre"],
                           dinero=dinero,
                           posicion=posicion,
                           cant_players = int(cant_players),
                           dbpartida = dbpartida)

@app.route('/empezar_partida', methods=['GET'])
def empezar_partida():
  bdpartida = dbPartida()
  #cant_players= session["partida"]["cant_players"]
  return str(bdpartida[3])
  
@app.route('/tirar_dados', methods=['POST'])
def tirar_dados():
    dbpartida = dbPartida()
    dado1 = request.form["dado1"]
    dado2 = request.form["dado2"]
    turno = dbpartida[2]
    if str(turno) in json.loads(dbpartida[13]).keys():
      preso = "si"

      nueva_prision = json.loads(dbpartida[13])
      if nueva_prision[str(dbpartida[2])] != 1:
        nueva_prision[str(dbpartida[2])] -= 1
      else:
        del nueva_prision[str(dbpartida[2])]
      if dado1 == dado2:
        del nueva_prision[str(dbpartida[2])]
      e = sqlite3.connect('monopoly.db')
      q = f"""UPDATE Partidas SET prision = '{json.dumps(nueva_prision)}' WHERE anfitrion = '{session["nombre"]}'"""
      e.execute(q)
      e.commit()
      e.close()
      
    else: 
      preso = "no"
      
  
    conn = sqlite3.connect('monopoly.db')
    resu = conn.execute(f"""SELECT * FROM Casillas""")
    resul = resu.fetchall()
    conn.close()
    conn2 = sqlite3.connect('monopoly.db')
    resu2 = conn2.execute(f"""SELECT * FROM Suerte""")
    resul2 = resu2.fetchall()
    conn2.close()
    dbpartida2 = dbPartida()
    posicion = dbpartida2[7+dbpartida[2]]
    return [dbpartida2, posicion, resul, resul2, preso]



@app.route('/moverse', methods=["POST"])
def moverse():
  player = request.form["player"]
  cantidad = request.form["cantidad"]
  dbpartida = dbPartida()

  posicion = dbpartida[7 + int(player[-1])]
  if posicion + int(cantidad) >= 40:
      posicion -= 40;
  posicion += int(cantidad)
  
  f = sqlite3.connect('monopoly.db')
  t = f"""UPDATE Partidas SET jugador{player[-1]}posicion = '{posicion}' WHERE anfitrion = '{session["nombre"]}'"""
  f.execute(t)
  f.commit()
  f.close()
  dbpartida2 = dbPartida()


  
  return [dbpartida, dbpartida2]


@app.route('/comprar', methods=["GET"])
def comprar():
  conn = sqlite3.connect('monopoly.db')
  resu = conn.execute(f"""SELECT * FROM Casillas""")
  resul = resu.fetchall()
  conn.close()
  dbpartida = dbPartida()
  return [dbpartida, resul]

@app.route('/subasta', methods=["GET"])
def subasta():
  conn = sqlite3.connect('monopoly.db')
  resu = conn.execute(f"""SELECT * FROM Casillas""")
  resul = resu.fetchall()
  conn.close()
  dbpartida = dbPartida()
  
  nueva_subasta = {"actual":dbpartida[2]}
  for a in range(4):
    if dbpartida[3 + a+1] != None:
      nueva_subasta[str(a+1)] = 0
      
  e = sqlite3.connect('monopoly.db')
  q = f"""UPDATE Partidas SET subasta = '{json.dumps(nueva_subasta)}' WHERE anfitrion = '{session["nombre"]}'"""
  e.execute(q)
  e.commit()
  e.close()
  dbpartida2 = dbPartida()
  return[dbpartida, resul, resul[dbpartida[7 +dbpartida[2]]], nueva_subasta, dbpartida2]


@app.route('/subir_subasta', methods=["POST"])
def subir_subasta():
  dbpartida = dbPartida()
  subasta = json.loads(dbpartida[14])
  actual = subasta["actual"]
  subasta_keys = list(subasta.keys())
  estado = ""
  input = int(request.form["input"])
  anterior = ""
  nueva_subasta=json.dumps({})
  if subasta_keys.index(str(subasta["actual"])) == 0:
    anterior = int(subasta_keys[-2])
  else:
    anterior = int(subasta_keys[subasta_keys.index(str(subasta["actual"]))-1])
  #verifica si el monto es valido y de un estado
  if input <= 0 or input >= dbpartida[3+ subasta["actual"]]:
    estado = "invalido"
  elif input < subasta[str(anterior)] + 10:
    estado = "casivalido"
  elif input <= subasta[str(anterior)]:
    estado = "menor"
  else:
    estado = "bien"
    subasta[str(subasta["actual"])] = input





    
    if subasta_keys.index(str(subasta["actual"]))+1 == len(subasta_keys)-1:
      subasta["actual"] = int(subasta_keys[0])
    else:
      subasta["actual"] = int(subasta_keys[subasta_keys.index(str(subasta["actual"]))+1])
  
    
  
  
  
    
    nueva_subasta = json.dumps(subasta)
    
    e = sqlite3.connect('monopoly.db')
    q = f"""UPDATE Partidas SET subasta = '{nueva_subasta}' WHERE anfitrion = '{session["nombre"]}'"""
    e.execute(q)
    e.commit()
    e.close()
    
  return [json.loads(nueva_subasta), actual, str(input), estado, anterior]


@app.route('/abandonar_subasta', methods=["POST"])
def abandonar_subasta():
  dbpartida = dbPartida()
  nueva_subasta = json.loads(dbpartida[14])
  subasta_keys = list(nueva_subasta.keys())
  actual1 = nueva_subasta["actual"]
  if len(subasta_keys)> 3:
    estado="sigue"
  else:
    estado="termina"
    
    
  
  if subasta_keys.index(str(nueva_subasta["actual"]))+1 == len(subasta_keys)-1:
    nueva_subasta["actual"] = int(subasta_keys[0])
  else:    
    nueva_subasta["actual"]=int(subasta_keys[subasta_keys.index(str(nueva_subasta["actual"]))+1])
  actual2 = nueva_subasta["actual"]
  precio =nueva_subasta[str(nueva_subasta["actual"])]
  if subasta_keys.index(str(nueva_subasta["actual"])) == 0:
    del nueva_subasta[subasta_keys[-2]]
  else:
    del nueva_subasta[subasta_keys[subasta_keys.index(str(nueva_subasta["actual"]))-1]]
    
  e = sqlite3.connect('monopoly.db')
  q = f"""UPDATE Partidas SET subasta = '{json.dumps(nueva_subasta)}' WHERE anfitrion = '{session["nombre"]}'"""
  e.execute(q)
  e.commit()
  e.close()
  
  
  return [nueva_subasta, estado,actual1, actual2, precio]

@app.route('/suerte', methods=["POST"])
def suerte():
  tipo = request.form["tipo"]
  conn = sqlite3.connect('monopoly.db')
  resu = conn.execute(f"""SELECT * FROM Suerte WHERE dominio == '{tipo}'""")
  resul = resu.fetchall()
  conn.close()
  dbpartida = dbPartida()
  a = resul[random.randint(0, 15)]
  return [a, dbpartida]

@app.route('/carcel', methods=["GET"])
def carcel():
  dbpartida = dbPartida()
  turno = int(dbpartida[2])
  prision = json.loads(dbpartida[13])
  prision[str(turno)] = 3
  prision = json.dumps(prision)
  e = sqlite3.connect('monopoly.db')
  q = f"""UPDATE Partidas SET jugador{str(turno)}posicion = '{10}', prision = '{prision}' WHERE anfitrion = '{session["nombre"]}'"""
  e.execute(q)
  e.commit()
  e.close()
  dbpartida2 = dbPartida()
  return [dbpartida2]


@app.route('/cambio_dinero', methods=["POST"])
def cambio_dinero(): 
  persona = request.form["persona"]
  
  monto = request.form["monto"]
  dbpartida = dbPartida()
  
  nuevo_monto = dbpartida[3 + int(persona[-1])] + int(monto)
  
  e = sqlite3.connect('monopoly.db')
  q = f"""UPDATE Partidas SET jugador{persona[-1]}dinero = '{nuevo_monto}' WHERE anfitrion = '{session["nombre"]}'"""
  e.execute(q)
  e.commit()
  e.close()

  dbpartida2 = dbPartida()

  
  
  return [dbpartida, dbpartida2, persona, monto]

@app.route("/pre_negociar", methods=["GET"])
def pre_negociar():
  dbpartida = dbPartida()
  conn = sqlite3.connect('monopoly.db')
  resu = conn.execute(f"""SELECT * FROM Casillas""")
  resul = resu.fetchall()
  conn.close()
  return [dbpartida, resul]



@app.route("/selector_negociar", methods=["GET"])
def selector_negociar():
  dbpartida = dbPartida()
  conn = sqlite3.connect('monopoly.db')
  resu = conn.execute(f"""SELECT * FROM Casillas""")
  resul = resu.fetchall()
  conn.close()
  return [dbpartida, resul]



@app.route("/montopersonas", methods=["GET"])
def montopersonas():
  dbpartida = dbPartida()
  return [dbpartida]

  

@app.route("/aceptar_trato", methods=["POST"])
def aceptar_trato():
  monto_persona1 = request.form["value1"]
  propiedad_persona1 = request.form["value2"]
  monto_persona2 = request.form["value3"]
  propiedad_persona2 = request.form["value4"]
  persona2 = request.form["value5"]
  dbpartida = dbPartida()
  persona1 = "player" + str(dbpartida[2])
  dbpartida_propiedades =json.loads(dbpartida[12])
  
  nuevo_monto_persona1 = dbpartida[3+dbpartida[2]] - int(monto_persona1) + int(monto_persona2)
  if propiedad_persona2 != "-----":
    dbpartida_propiedades[persona1][propiedad_persona2] = 0
    del dbpartida_propiedades[persona2][propiedad_persona2]
  
  
  nuevo_monto_persona2 = dbpartida[3+int(persona2[-1])]-int(monto_persona2) + int(monto_persona1)
  if propiedad_persona1 != "-----":
    dbpartida_propiedades[persona2][propiedad_persona1] = 0
    del dbpartida_propiedades[persona1][propiedad_persona1]
  
  
  nueva_propiedad_persona1 = dbpartida_propiedades[persona1]
  nueva_propiedad_persona2 = dbpartida_propiedades[persona2]


  dbpartida_propiedadess = json.dumps(dbpartida_propiedades)
  e = sqlite3.connect('monopoly.db')
  q = f"""UPDATE Partidas SET jugador{persona1[-1]}dinero = '{nuevo_monto_persona1}',jugador{persona2[-1]}dinero = '{nuevo_monto_persona2}', propiedades = '{dbpartida_propiedadess}' WHERE anfitrion = '{session["nombre"]}'"""
  e.execute(q)
  e.commit()
  e.close()
  
  dbpartida2 = dbPartida()


  
  
  
  return [dbpartida, dbpartida2]
  
#------------------------------------------------------------------------
#----------------------------------------------------------------------------
#------------------------------------------------------------------------
#----------------------------------------------------------------------------
@app.route("/construir", methods=["GET"])
def construir():
  
  dbpartida = dbPartida()
  conn = sqlite3.connect('monopoly.db')
  resu = conn.execute(f"""SELECT * FROM Casillas""")
  resul = resu.fetchall()
  conn.close()
  lista = json.loads(dbpartida[12])["player" + str(dbpartida[2])]
  listaColores = []
  for a in resul:
    listaColores.append(a[2])
  
  
  return [dbpartida, resul, lista, listaColores]
#------------------------------------------------------------------------------------------
#------------------------------------------------------------------------
#----------------------------------------------------------------------------
#------------------------------------------------------------------------
#----------------------------------------------------------------------------
@app.route("/funcion_rivas", methods=["POST"])
def funcion_rivas():
  tipo =request.form["tipo"]
  
  dbpartida = dbPartida()
  conn = sqlite3.connect('monopoly.db')
  resu = conn.execute(f"""SELECT * FROM Casillas""")
  resul = resu.fetchall()
  conn.close()
  propiedades = json.loads(dbpartida[12])
  propiedades_jugador=[]
  for a in len(resul):
    if propiedades["player"+ str(dbpartida[2])][str(a)]:
      propiedades_jugador.append(str(a))
    
  return [tipo, propiedades_jugador]
  

@app.route("/modif_casa", methods=["POST"])
def modif_casa():
  tipo = request.form["value1"]
  id_propiedad = request.form["value2"]
  dbpartida = dbPartida()
  
  turno = "player" + str(dbpartida[2])
  props = json.loads(dbpartida[12])

  conn = sqlite3.connect('monopoly.db')
  resu = conn.execute(f"""SELECT * FROM Casillas""")
  resul = resu.fetchall()
  dinero = dbpartida[3+dbpartida[2]]
  conn.close()
  
  if tipo == "comprar" and props[turno][id_propiedad]<=4:
    props[turno][id_propiedad]+= 1
    dinero -= resul[int(id_propiedad)-1][11]
  elif tipo == "vender" and props[turno][id_propiedad] >=1:
    props[turno][id_propiedad] -= 1
    dinero += resul[int(id_propiedad)-1][11]/2
  elif tipo == "vender" and props[turno][id_propiedad] == 0:
    props[turno][id_propiedad] = -1
    dinero += resul[int(id_propiedad)-1][4]/2
  
  
  nuevasPropiedades = json.dumps(props)
  
  e = sqlite3.connect('monopoly.db')
  q = f"""UPDATE Partidas SET propiedades = '{nuevasPropiedades}', jugador{dbpartida[2]}dinero = {dinero} WHERE anfitrion = '{session["nombre"]}'"""
  e.execute(q)
  e.commit()
  e.close()


  
  dbpartida2 = dbPartida()
  return [dbpartida2[12], dbpartida2[2], resul]
















@app.route('/pasar_turno', methods=["GET"])
def pasar_turno(): 
  dbpartida = dbPartida()
  turno = dbpartida[2]
  # quizas tambien sacarlo de prision
  # hacer cada vez que pasas turno se elimine cualquier jugador que tenga dinero <= 0(no solo el siguiente)
  
  if dbpartida[3 + turno] <= 0:
      propiedades  = json.loads(dbpartida[12])
      propiedades["player" + str(turno)] = {}
      nuevas_propiedades = json.dumps(propiedades)
      r = sqlite3.connect('monopoly.db')
      w = f"""UPDATE Partidas SET jugador{turno}dinero = NULL, jugador{turno}posicion = NULL, cantidadjugadores = '{dbpartida[3]-1}', propiedades = '{nuevas_propiedades}' WHERE anfitrion = '{session["nombre"]}'"""
      r.execute(w)
      r.commit()
      r.close()
      jugador_eliminado = turno
  else:
    jugador_eliminado = 0
  jugadores = []
  for a in range(4):
    if dbpartida[3 + a+1] != None:
      jugadores.append(a+1)
  if jugadores.index(turno)+1 == dbpartida[3]:
    nuevo_turno = jugadores[0]
  else:
    nuevo_turno = jugadores[jugadores.index(turno) +1]
  
  e = sqlite3.connect('monopoly.db')
  q = f"""UPDATE Partidas SET turno = '{nuevo_turno}' WHERE anfitrion = '{session["nombre"]}'"""
  e.execute(q)
  e.commit()
  e.close()
  
  return [str(turno), str(nuevo_turno), dbpartida, jugador_eliminado]






@app.route('/adquirirPropiedad', methods=["POST"])
def adquirirPropiedad():
  idprop = request.form["idprop"]
  player = request.form["player"]
  dbpartida = dbPartida()
  a = json.loads(dbpartida[12])
  
  a[player][idprop] = 0
  a = json.dumps(a)
  e = sqlite3.connect('monopoly.db')
  q = f"""UPDATE Partidas SET propiedades= '{a}' WHERE anfitrion = '{session["nombre"]}'"""
  e.execute(q)
  e.commit()
  e.close()
  dbpartida2 = dbPartida()


  
  return json.loads(dbpartida2[12])


def dbPartida():
  c = sqlite3.connect('monopoly.db')
  d = c.execute(f"""SELECT * FROM Partidas WHERE anfitrion = '{session["nombre"]}'""")
  bdpartida = d.fetchall()
  c.close()
  return bdpartida[0]
  
app.run(host='0.0.0.0', port=81)



