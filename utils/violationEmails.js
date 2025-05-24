const sgMail = require("@sendgrid/mail");
dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "../.env") });
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const ViolationsEmployeeRecord = require("../models/ViolationsEmployeeRecord");

async function notifyIfStatusChanged(employeeId, previousWeight) {
  try {
    const currentWeight =
      await ViolationsEmployeeRecord.getEmployeeTotalViolationWeight(
        employeeId
      );

    if (previousWeight === 0 && currentWeight <= 0.5) {
      return {
        status: "skipped",
        message: "No email needed for clean/verbal status",
      };
    }

    const getStatus = (weight) => {
      if (weight >= 3) return "Termination Risk";
      if (weight >= 2) return "Final Warning";
      if (weight >= 1) return "First Warning";
      if (weight >= 0.5) return "Verbal Warning";
      return "Clean";
    };

    const prevStatus = getStatus(previousWeight);
    const newStatus = getStatus(currentWeight);

    if (newStatus === prevStatus || currentWeight < previousWeight) {
      return {
        status: "skipped",
        message: "Status unchanged or downgraded, no email sent",
      };
    }

    if (newStatus === "Verbal Warning") {
      return {
        status: "skipped",
        message: "Verbal warnings do not trigger emails",
      };
    }

    const msg = {
      to: "kha2000.khaled@gmail.com",
      from: "ahfannas@gmail.com",
      subject: `New Disciplinary Status: ${newStatus}`,
      text: `Dear Employee,\n\nHope this email finds you well, Your disciplinary record has been updated. Your current status is: ${newStatus}\n\nPlease take this matter seriously.\n\nBest regards,\nHR Team`,
    };

    await sgMail.send(msg);

    return { status: "sent", message: `Email sent with status: ${newStatus}` };
  } catch (error) {
    return {
      status: "error",
      message: `Failed to send email: ${error.message}`,
    };
  }
}

module.exports = {
  notifyIfStatusChanged,
};
