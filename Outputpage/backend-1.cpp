#include <iostream>
#include <fstream>
#include <string>

using namespace std;

class HeartRateCalculator {

private:
    int age;
    int restingHR;
    int maxHR;

public:

    void getInput() {

        cout << "==============================\n";
        cout << "   AI HEART RATE MONITOR\n";
        cout << "==============================\n\n";

        cout << "Enter Age: ";
        cin >> age;

        cout << "Enter Resting Heart Rate: ";
        cin >> restingHR;

        maxHR = 220 - age;
    }

    void calculateZones() {

        int fatBurnLow  = maxHR * 0.50;
        int fatBurnHigh = maxHR * 0.60;

        int fitnessLow  = maxHR * 0.60;
        int fitnessHigh = maxHR * 0.70;

        int cardioLow   = maxHR * 0.70;
        int cardioHigh  = maxHR * 0.80;

        int peakLow     = maxHR * 0.80;
        int peakHigh    = maxHR * 0.90;

        cout << "\n==============================\n";
        cout << " HEART RATE ZONES\n";
        cout << "==============================\n\n";

        cout << "Maximum Heart Rate : "
             << maxHR << " BPM\n\n";

        cout << "Fat Burn Zone : "
             << fatBurnLow << " - "
             << fatBurnHigh << " BPM\n";

        cout << "Fitness Zone  : "
             << fitnessLow << " - "
             << fitnessHigh << " BPM\n";

        cout << "Cardio Zone   : "
             << cardioLow << " - "
             << cardioHigh << " BPM\n";

        cout << "Peak Zone     : "
             << peakLow << " - "
             << peakHigh << " BPM\n";
    }

    void saveReport() {

        ofstream file("HeartRateReport.txt");

        file << "AI HEART RATE REPORT\n";
        file << "========================\n";
        file << "Age : " << age << endl;
        file << "Resting HR : "
             << restingHR << endl;

        file << "Maximum HR : "
             << maxHR << endl;

        file.close();

        cout << "\nReport Saved Successfully!\n";
    }
};

int main() {

    HeartRateCalculator hr;

    hr.getInput();

    hr.calculateZones();

    hr.saveReport();

    cout << "\nProject Executed Successfully!\n";

    return 0;
}