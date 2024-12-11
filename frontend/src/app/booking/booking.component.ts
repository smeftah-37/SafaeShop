import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-booking',
  standalone: true,
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements AfterViewInit {
  @ViewChild('multiStepForm') multiStepForm!: ElementRef<HTMLFormElement>;

  ngAfterViewInit() {
    const form = this.multiStepForm.nativeElement;
    const steps = form.querySelectorAll('.form-step');
    const nextBtns = form.querySelectorAll('.next-step');
    const prevBtns = form.querySelectorAll('.prev-step');
    const summary = form.querySelector('#summary') as HTMLElement;
    let currentStep = 0;

    function validateStep() {
      let stepIsValid = true;
      const currentInputs = steps[currentStep].querySelectorAll('input, textarea');
      currentInputs.forEach(input => {
        const inputEl = input as HTMLInputElement | HTMLTextAreaElement;
        if (!inputEl.checkValidity()) {
          inputEl.reportValidity();
          stepIsValid = false;
        }
      });
      return stepIsValid;
    }

    function displaySummary() {
      const name = (form.querySelector('#name') as HTMLInputElement)?.value || 'N/A';
      const email = (form.querySelector('#email') as HTMLInputElement)?.value || 'N/A';
      const checkedPrefs = Array.from(form.querySelectorAll('input[name="pref"]:checked')) as HTMLInputElement[];
      const prefs = checkedPrefs.map(el => el.value).join(', ') || 'None';
      const comments = (form.querySelector('#comments') as HTMLTextAreaElement)?.value || 'None';

      summary.innerHTML = `
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Preferences:</strong> ${prefs}</p>
          <p><strong>Comments:</strong> ${comments}</p>
      `;
    }

    nextBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (validateStep()) {
          steps[currentStep].classList.remove('active');
          currentStep++;
          if (currentStep < steps.length) {
            steps[currentStep].classList.add('active');
          }
          if (currentStep === steps.length - 1) {
            displaySummary();
          }
        }
      });
    });

    prevBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        steps[currentStep].classList.remove('active');
        currentStep--;
        steps[currentStep].classList.add('active');
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Form successfully submitted!');
      form.reset();
      steps[currentStep].classList.remove('active');
      currentStep = 0;
      steps[currentStep].classList.add('active');
    });

    // Initialize steps
    steps.forEach((step, index) => {
      if (index !== currentStep) {
        step.classList.remove('active');
      } else {
        step.classList.add('active');
      }
    });
  }
}
