#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <map>
#include <algorithm>

using namespace std;

int main() {
    vector<string> people;
    string input, payer;
    map<string, double> amounts;

    // Enter the people to pay
    cout << "Enter the people to pay (type 'done' when finished):" << endl;
    while (true) {
        cout << "Enter name: ";
        getline(cin, input);
        if (input == "done") break;
        input.erase(remove(input.begin(), input.end(), ' '), input.end());
        people.push_back(input);
        amounts[input] = 0.0;
    }

    // Ask who paid the bill
    cout << "Who paid the bill: ";
    getline(cin, payer);
    payer.erase(remove(payer.begin(), payer.end(), ' '), payer.end());

    // Enter the products and prices on the invoice
    vector<pair<string, double>> products;
    cout << "Enter the products and prices on the invoice (format: product price, ...): ";
    getline(cin, input);
    stringstream ss(input);
    string product;
    double price;
    while (ss >> product >> price) {
        products.push_back(make_pair(product, price));
        if (ss.peek() == ',') ss.ignore();
    }

    // Process each product
    for (const auto& item : products) {
        string productName = item.first;
        double productPrice = item.second;
        vector<string> productPayers;

        // Ask who will pay for each product
        cout << "Who will pay for " << productName << " (comma separated): ";
        getline(cin, input);
        ss.clear();
        ss.str(input);
        while (getline(ss, person, ',')) {
            person.erase(remove(person.begin(), person.end(), ' '), person.end());
            productPayers.push_back(person);
        }

        // Divide the price among the payers
        double share = productPrice / productPayers.size();
        for (const auto& p : productPayers) {
            amounts[p] += share;
        }
    }

    // Output the amounts each person needs to pay
    for (const auto& entry : amounts) {
        if (entry.first != payer) {
            cout << entry.first << " will send money " << entry.second << " lira to " << payer << endl;
        }
    }

    return 0;
}
