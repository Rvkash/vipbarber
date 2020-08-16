const Database = require('./database/db')

const { subjects, weekdays, getSubject, convertHoursToMinutes } = require('./utils/format')

function pageLanding(req, res) {
  return res.render("index.html")
}

async function agendar(req, res) {
  const filters = req.query

  if (!filters.subject || !filters. weekday || !filters.time) {
    return res.render("agendar.html", { filters, subjects, weekdays })
  }

  const timeToMinutes = convertHoursToMinutes(filters.time)

  const query = `
    SELECT classes.*, barbers.*
    FROM barbers
    JOIN classes ON (classes.barber_id = barbers.id)
    WHERE EXISTS (
      SELECT class_schedule.*
      FROM class_schedule
      WHERE class_schedule.class_id = classes.id
      AND class_schedule.weekday = ${filters.weekday}
      AND class_schedule.time_from <= ${timeToMinutes}
      AND class_schedule.time_to > ${timeToMinutes}
    )
    AND classes.subject = "${filters.subject}"
  `

  try {
    const db = await Database
    const barbers = await db.all(query)

    barbers.map((barber) => {
      barber.subject = getSubject(barber.subject)
    })

    return res.render("agendar.html", { barbers, subjects, filters, weekdays })


  } catch (error) {
    console.log(error)
  }
}

function cadastro(req, res) {
  return res.render("cadastro.html", { subjects, weekdays })
}

async function saveClasses(req, res) {
  const createBarber = require('./database/createBarber')
  
  const barberValue = {
    name: req.body.name,
    avatar: req.body.avatar,
    whatsapp: req.body.whatsapp,
    bio: req.body.bio
  }

  const classValue = {
    subject: req.body.subject,
    cost: req.body.cost
  }

  const classScheduleValues = req.body.weekday.map((weekday, index) => {
    return {
      weekday,
      time_from: convertHoursToMinutes(req.body.time_from[index]),
      time_to: convertHoursToMinutes(req.body.time_to[index])
    }
  })
  
  try {
    const db = await Database
    await createBarber(db, { barberValue, classValue, classScheduleValues })

    let queryString = "?subject=" + req.body.subject
    queryString += "&weekday=" + req.body.weekday[0]
    queryString += "&time=" + req.body.time_from[0]

    return res.redirect("/agendar" + queryString)
  } catch (error) {
    console.log(error)
  }
  
} 

module.exports = {
  pageLanding,
  agendar,
  cadastro,
  saveClasses
}