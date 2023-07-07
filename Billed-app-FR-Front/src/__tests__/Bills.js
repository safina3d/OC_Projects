/**
 * @jest-environment jsdom
 */

import {fireEvent, screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import {bills} from "../fixtures/bills.js"
import {ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";

import router from "../app/Router.js";
import Bills from "../containers/Bills.js";
import mockedStore from "../__mocks__/store.js";
import {formatDate, formatStatus} from "../app/format.js";


describe("Given I am connected as an employee", () => {
    describe("When I am on Bills Page", () => {
        test("Then bill icon in vertical layout should be highlighted", async () => {
            Object.defineProperty(window, 'localStorage', {value: localStorageMock})
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))
            const root = document.createElement("div")
            root.setAttribute("id", "root")
            document.body.append(root)
            router()
            window.onNavigate(ROUTES_PATH.Bills)
            await waitFor(() => screen.getByTestId('icon-window'))
            const windowIcon = screen.getByTestId('icon-window')
            //to-do write expect expression
            expect(windowIcon.classList.contains('active-icon')).toBe(true);
        });

        test("Then bills should be ordered from earliest to latest", () => {
            document.body.innerHTML = BillsUI({data: bills})
            const dates = Array
                .from(document.querySelectorAll("td[data-date]"))
                .map(el => el.getAttribute('data-date'));
            const antiChrono = (a, b) => ((a < b) ? -1 : 1)
            const datesSorted = [...dates].sort(antiChrono)
            expect(dates).toEqual(datesSorted)
        });

        test("Then the modal should be displayed when the eye icon is clicked", async () => {
            document.body.innerHTML = BillsUI({data: bills})
            const _bills = new Bills({
                document,
                onNavigate,
                store: mockedStore,
                localStorage: localStorageMock
            })

            const eyeBtn = screen.getAllByTestId('icon-eye')[0]
            expect(eyeBtn).toBeTruthy();

            $.fn.modal = jest.fn();
            const handleClickIconEyeSpy = jest.spyOn(_bills, 'handleClickIconEye');
            fireEvent.click(eyeBtn)

            expect(handleClickIconEyeSpy).toHaveBeenCalled();
            expect($.fn.modal).toHaveBeenCalledWith('show');
        });

        describe("And I click on the add new bill button", () => {
            test("Then I'm redirected to the NewBill page", () => {
                document.body.innerHTML = BillsUI({data: bills});
                const newBillButton = screen.getByTestId('btn-new-bill');
                expect(newBillButton).toBeTruthy();

                const onNavigateSpy = jest.fn();
                new Bills({
                    document,
                    onNavigate: onNavigateSpy,
                    localStorage: window.localStorage
                });

                fireEvent.click(newBillButton);
                expect(onNavigateSpy).toHaveBeenCalledWith(ROUTES_PATH['NewBill']);
            });
        });

        test("Then I should retrieve the list of all my bills", async () => {
            const _bills = new Bills({
                document,
                onNavigate,
                store: mockedStore,
                localStorage: localStorageMock
            });

            const mockedBillList = await mockedStore.bills().list();
            const resultBills = await _bills.getBills();

            expect(resultBills.length).toBe(mockedBillList.length);
            expect(resultBills[0].date).toBe(formatDate(mockedBillList[0].date));
            expect(resultBills[0].status).toBe(formatStatus(mockedBillList[0].status));
        });


        test("Then it should handle wrong date format", async () => {
            // Setting an incorrect date format
            bills[0].date = '2018x01x13';
            const _bills = new Bills({
                document,
                onNavigate,
                store: mockedStore,
                localStorage: localStorageMock
            });

            jest.spyOn(mockedStore.bills(), "list").mockResolvedValue(bills);
            const consoleLogSpy = jest.spyOn(console, "log");

            const resultBills = await _bills.getBills();

            expect(consoleLogSpy).toHaveBeenCalled();
            expect(resultBills[0].date).toEqual(bills[0].date);
        });

        // Tests d'integration GET
        describe("When an error occurs on the API",  () => {
            test("fetches bills from an API and fails with 404 message error", async () => {
                jest.spyOn(mockedStore.bills(), "list").mockRejectedValueOnce(new Error("Error 404"));

                let error;
                try {
                    await mockedStore.bills().list();
                } catch (err) {
                    error = err;
                }

                document.body.innerHTML = BillsUI({ error: error.message });
                expect(screen.getByText(/Error 404/)).toBeTruthy();
            });

            test("fetches messages from an API and fails with 500 message error", async () => {
                jest.spyOn(mockedStore.bills(), "list").mockRejectedValueOnce(new Error("Error 500"));

                let error;
                try {
                    await mockedStore.bills().list();
                } catch (err) {
                    error = err;
                }

                document.body.innerHTML = BillsUI({ error: error.message });
                expect(screen.getByText(/Error 500/)).toBeTruthy();
            });
        });
    });
})

