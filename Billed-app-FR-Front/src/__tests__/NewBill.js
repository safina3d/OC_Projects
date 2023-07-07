/**
 * @jest-environment jsdom
 */

import {fireEvent, screen, waitFor} from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import {localStorageMock} from "../__mocks__/localStorage.js";
import router from "../app/Router.js";
import {ROUTES_PATH} from "../constants/routes.js";
import mockedStore from "../__mocks__/store.js";

let newBill;
describe("Given I am connected as an employee", () => {

  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee'
    }))
    const root = document.createElement("div")
    root.setAttribute("id", "root")
    document.body.append(root)
    router()
    window.onNavigate(ROUTES_PATH.NewBill);
  });

  beforeEach(() => {
    document.body.innerHTML = NewBillUI();
    newBill = new NewBill({
      document,
      onNavigate,
      store: mockedStore,
      localStorage: localStorageMock
    });
  });

  describe("When I am on NewBill Page", () => {

    describe("And I select a correct file format", () => {
      test("Then the selected file should be uploaded and its URL stored", async () => {
        const fileInput = screen.getByTestId('file');
        expect(fileInput).toBeTruthy();

        fireEvent.change(fileInput, {
          target: { files: [new File(['test'], 'test.png', { type: 'image/png' })] },
        });

        expect(fileInput.files[0].name).toBe('test.png');

        await waitFor(() => {
          expect(newBill.fileUrl).toEqual('https://localhost:3456/images/test.jpg');
          expect(fileInput.classList).not.toContain('error-incorrect-file-format');
        });
      });
    });

    describe("And I select an incorrect file format file format", () => {
      test("Then the selected file should NOT be uploaded, and its URL should NOT be stored", async () => {
        const inputFile = screen.getByTestId('file');
        expect(inputFile).toBeTruthy();

        fireEvent.change(inputFile, {
          target: { files: [new File(['test'], 'test.txt', { type: 'text/plain' })] },
        });

        expect(inputFile.files[0].name).toBe('test.txt');

        await waitFor(() => {
          expect(newBill.fileUrl).toBeNull();
          expect(inputFile.classList).toContain('error-incorrect-file-format');
        });
      });
    });

    test("Then I should be able to submit a filled form", async () => {
      const form = screen.getByTestId("form-new-bill");
      const fileInput = screen.getByTestId('file');
      const expenseTypeInput = screen.getByTestId("expense-type");
      const expenseNameInput = screen.getByTestId("expense-name");
      const datePickerInput = screen.getByTestId("datepicker");
      const amountInput = screen.getByTestId("amount");
      const vatInput = screen.getByTestId("vat");
      const pctInput = screen.getByTestId("pct");
      const commentaryInput = screen.getByTestId("commentary");

      fireEvent.change(expenseTypeInput, { target: { value: "Transports" } });
      fireEvent.change(expenseNameInput, { target: { value: "TGV" } });
      fireEvent.change(datePickerInput, { target: { value: "2023-06-10" } });
      fireEvent.change(amountInput, { target: { value: 100 } });
      fireEvent.change(vatInput, { target: { value: 20 } });
      fireEvent.change(pctInput, { target: { value: 70 } });
      fireEvent.change(commentaryInput, { target: { value: "Train en retard!" } });

      fireEvent.change(fileInput, { target: { files: [new File(['test'], 'test.png', { type: 'image/png' })] } });

      await waitFor(() => {
        expect(newBill.fileUrl).toEqual('https://localhost:3456/images/test.jpg');
        expect(fileInput.classList).not.toContain('error-incorrect-file-format');
      });

      const mockUpdateBill = jest.spyOn(newBill, 'updateBill');
      const mockOnNavigate = jest.spyOn(newBill, 'onNavigate');

      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockUpdateBill).toHaveBeenCalledWith({
          "email": JSON.parse(localStorageMock.getItem("user")).email,
          "type": "Transports",
          "name": "TGV",
          "amount": 100,
          "date": "2023-06-10",
          "commentary": "Train en retard!",
          "fileName": 'test.png',
          "fileUrl": "https://localhost:3456/images/test.jpg",
          "pct": 70,
          "vat": "20",
          "status": "pending",
        });
        expect(mockOnNavigate).toHaveBeenCalledWith(ROUTES_PATH["Bills"]);
      });
    });
   
    test('Then, it should display an error message in the console if something goes wrong with the bill file upload (Error 500)', async () => {
      const mockChangeFile = new Error("ChangeFile error");
      jest.spyOn(newBill.store.bills(), 'create').mockRejectedValueOnce(mockChangeFile);
      const consolErrorSpy = jest.spyOn(console, 'error');
    
      const inputFile = screen.getByTestId('file')
      expect(inputFile).toBeTruthy()
    
      fireEvent.change(inputFile, { target: { files: [new File(['test'], 'test.png', { type: 'image/png' })] } })
      await waitFor(() => {
          expect(consolErrorSpy).toHaveBeenCalledWith(mockChangeFile);
      });
    });

    test("Then, it should display an error message in the console if something goes wrong with update Bill process (Error 500)", async () => {
      const mockUpdateError = new Error("Update error");
      jest.spyOn(mockedStore.bills(), "update").mockRejectedValueOnce(mockUpdateError);
      const consolErrorSpy = jest.spyOn(console, 'error');
    
      newBill.updateBill({});
    
      await waitFor(() => {
        expect(consolErrorSpy).toHaveBeenCalledWith(mockUpdateError);
      });
    });

  })

})
