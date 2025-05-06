import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./src/db/db.js";
import promptSync from "prompt-sync";
import Customer from "./src/models/Customer.js";

connectDB();

const prompt = promptSync();
const username = prompt("What is your name? ");
console.log(`Your name is ${username}`);

const showMenu = () => {
  console.log("Welcome to the CRM");
  console.log("What would you like to do");
  console.log("1. Create a customer");
  console.log("2. View all customers");
  console.log("3. Update a customer");
  console.log("4. Delete a customer");
  console.log("5. Quit");
};

const main = async () => {
  let running = true;

  while (running) {
    showMenu();
    const choice = prompt("Number of action to run: ");

    switch (choice) {
      case "1":
        await createCustomer();
        break;
      case "2":
        await viewCustomers();
        break;
      case "3":
        await updateCustomer();
        break;
      case "4":
        await deleteCustomer();
        break;
      case "5":
        console.log("Exiting...");
        mongoose.connection.close(); // Proper exit
        running = false;
        break;
      default:
        console.log("Invalid choice, please enter a valid number.");
    }
  }
};

const createCustomer = async () => {
  const name = prompt("Enter customer name: ");
  const age = Number(prompt("Enter customer age: "));

  const newCustomer = new Customer({ name, age });
  await newCustomer.save();
  console.log("Customer created successfully!");
};

const viewCustomers = async () => {
  const customers = await Customer.find();
  console.log("Customer List:");
  customers.forEach((customer) => {
    console.log(
      `ID: ${customer._id} - Name: ${customer.name} - Age: ${customer.age}`
    );
  });
};

const updateCustomer = async () => {
  await viewCustomers();
  const id = prompt("Copy and paste customer ID to update: ");
  const name = prompt("New Name: ");
  const age = prompt("New Age: ");

  await Customer.findByIdAndUpdate(id, { name, age });
  console.log("Customer updated successfully");
};

const deleteCustomer = async () => {
  await viewCustomers();
  const id = prompt("Copy and paste customer ID to delete: ");

  await Customer.findByIdAndDelete(id);
  console.log("Customer deleted successfully");
};

main();
