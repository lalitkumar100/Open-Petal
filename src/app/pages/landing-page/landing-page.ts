import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-landing-page',
  standalone: false,
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage implements OnInit {
  isLoggedIn = false;
  userRole: string | null = null;

  skills = [
    { name: 'Python', category: 'Coding', icon: 'code', level: 'Popular' },
    { name: 'JavaScript & React', category: 'Web Dev', icon: 'web', level: 'Trending' },
    { name: 'UI/UX Design', category: 'Design', icon: 'palette', level: 'Hot' },
    { name: 'Spanish', category: 'Language', icon: 'translate', level: 'Popular' },
    { name: 'Digital Marketing', category: 'Business', icon: 'trending_up', level: 'High Demand' },
    { name: 'Data Analysis', category: 'Data', icon: 'analytics', level: 'Trending' }
  ];

  stats = [
    { value: '10K+', label: 'Sessions Completed' },
    { value: '500+', label: 'Skills Available' },
    { value: '98%', label: 'Satisfaction Rate' },
    { value: '0$', label: 'Cash Needed (Credit Barter)' }
  ];

  faqs = [
    {
      question: 'How does Skill Barter work?',
      answer: 'When you teach a skill to another member, you earn Credit Points. You can then use those credits to learn any skill offered by mentors across the platform!'
    },
    {
      question: 'How do AI-Generated Roadmaps work?',
      answer: 'Simply set a learning goal and target level. Our AI dynamically generates a step-by-step roadmap with milestones, nodes, and curated study resources.'
    },
    {
      question: 'What is Skill Verification?',
      answer: 'You can verify your knowledge by taking an AI-generated 5-question assessment. Upon passing, a "Verified" badge is awarded on your public profile!'
    },
    {
      question: 'Is OpenPetal free to join?',
      answer: 'Yes! Joining OpenPetal is 100% free. Every new user receives initial credits to start learning immediately.'
    }
  ];

  openFaqIndex: number | null = 0;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      const user = this.authService.getUser();
      this.userRole = user?.role || null;
    }
  }

  toggleFaq(index: number) {
    this.openFaqIndex = this.openFaqIndex === index ? null : index;
  }

  goToDashboard() {
    if (this.userRole === 'ROLE_ADMIN') {
      this.router.navigate(['/admin/home']);
    } else {
      this.router.navigate(['/user/home']);
    }
  }
}
