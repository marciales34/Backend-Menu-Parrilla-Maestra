const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./database");  // Aquí se importa la instancia de Sequelize configurada
const Usuario = require("./models/Usuario");
const Trabajador = require("./models/Trabajador");
const Reservacion = require("./models/Reservacion");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//CONEXION A LA BASE DE DATOS
sequelize.sync()
  .then(async () => {
    console.log("Conexión exitosa a la base de datos MySQL y sincronización de modelos");

    // Consulta a la base de datos para obtener todos los usuarios registrados
    try {
      const usuarios = await Usuario.findAll();
      console.log("Usuarios registrados:", usuarios.map(usuario => usuario.dataValues));
    } catch (err) {
      console.error("Error al consultar los usuarios:", err);
    }
  })
  .catch(err => {
    console.error("Error al conectar con la base de datos:", err);
  });


app.get("/", (req, res) => {
  res.send("¡Bienvenido a la nueva aplicación!");
});


//CONSULTA DE PRUEBA FUNCIONALIDAD 100%

app.get("/consultar", async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (err) {
    console.error("Error al ejecutar la consulta:", err);
    res.status(500).json({ error: "Error al ejecutar la consulta" });
  }
});

//REGISTRO PERSONAS PAGINA WEB

app.post("/registro", async (req, res) => {
  const { name, email, password, telefono } = req.body;
  try {
    const usuario = await Usuario.create({ name, email, password, telefono });
    res.status(200).json({ message: "Usuario registrado exitosamente", name: usuario.name, id: usuario.id_usuarios });
  } catch (err) {
    console.error("Error al registrar usuario:", err);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

//REGISTRO HOJAS DE VIDA NUEVOS TRABAJADORES

app.post("/registroTrabajadores", async (req, res) => {
  const { nombre, apellidos, email, telefono, hoja_vida } = req.body;
  try {
    const trabajador = await Trabajador.create({ nombre, apellidos, email, telefono, hoja_vida });
    res.status(200).json({ message: "Trabajador registrado exitosamente", name: trabajador.nombre });
  } catch (err) {
    console.error("Error al registrar Trabajador:", err);
    res.status(500).json({ error: "Error al registrar Trabajador" });
  }
});

//REGISTRO RESERVAS

app.post("/registrarReserva", async (req, res) => {
  const { fecha_reservacion, hora_reservacion, num_personas, nombre_usuario } = req.body;
  try {
    const usuario = await Usuario.findOne({ where: { name: nombre_usuario } });
    if (!usuario) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }
    const reserva = await Reservacion.create({
      fecha_reservacion,
      hora_reservacion,
      num_personas,
      id_usuarios: usuario.id_usuarios,
    });
    res.status(200).json({ message: "Reservación registrada exitosamente", nombre_usuario: usuario.name });
  } catch (err) {
    console.error("Error al registrar la reservación:", err);
    res.status(500).json({ error: "Error al registrar la reservación" });
  }
});


//SIMULACION DE LOGIN

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const usuario = await Usuario.findOne({ where: { email, password } });
    if (!usuario) {
      res.status(401).json({ error: "Correo electrónico o contraseña incorrectos" });
      return;
    }
    res.json({ message: "Inicio de sesión exitoso", usuario: usuario.name, id: usuario.id_usuarios });
  } catch (err) {
    console.error("Error al iniciar sesión:", err);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});


//BUSQUEDA DE RESERVACIONES:

app.get("/reservas/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const reservas = await Reservacion.findAll({ where: { id_usuarios: userId } });
    res.json(reservas);
  } catch (err) {
    console.error("Error al obtener las reservas:", err);
    res.status(500).json({ error: "Error al obtener las reservas" });
  }
});


// RUTA PARA ELIMINAR RESERVA

app.delete('/reservas/:id', async (req, res) => {
  const reservaId = req.params.id;

  try {
    
    await Reservacion.destroy({ where: { id_reservaciones: reservaId } });

    res.status(200).json({ message: 'Reserva eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la reserva:', error);
    res.status(500).json({ error: 'Error al eliminar la reserva' });
  }
});

// RUTA PARA ACTUALIZAR LA RESERVA
app.put('/reservas/:id', async (req, res) => {
  const reservaId = req.params.id;
  const nuevosDatosReserva = req.body;

  try {
    // Aquí realizas la lógica para actualizar la reserva en la base de datos
    await Reservacion.update(nuevosDatosReserva, { where: { id_reservaciones: reservaId } });

    res.status(200).json({ message: 'Reserva actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar la reserva:', error);
    res.status(500).json({ error: 'Error al actualizar la reserva' });
  }
});


//CONECTA A LA BASE DE DATOS PARA LA PAGINA WEB

app.post("/conectar", (req, res) => {
  res.json({ message: "Conexión exitosa a la base de datos" });
});


//PUERTO DEL SERVIDOR
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
