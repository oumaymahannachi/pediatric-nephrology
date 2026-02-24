import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import {
  LucideAngularModule,
  ArrowLeft, Award, Baby, BarChart3, Bell, Building2, Calendar, Check,
  ChevronDown, ChevronLeft, ChevronRight, ClipboardList, Edit, Eye, EyeOff, Facebook, FileText, Heart,
  Home, Instagram, LayoutDashboard, Linkedin, Lock, LogOut, Mail, Menu, MessageSquare,
  Phone, Plus, Save, Settings, Shield, ShieldCheck, Star, Stethoscope, TrendingUp,
  Twitter, User, UserCircle, Users, X, Activity, Clock, MapPin, AlertCircle, CheckCircle,
  HeartPulse, Syringe, Thermometer, Trash2, Search, Ban, UserCheck, RefreshCw
} from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    provideAnimations(),
    importProvidersFrom(LucideAngularModule.pick({
      ArrowLeft, Award, Baby, BarChart3, Bell, Building2, Calendar, Check,
      ChevronDown, ChevronLeft, ChevronRight, ClipboardList, Edit, Eye, EyeOff, Facebook, FileText, Heart,
      Home, Instagram, LayoutDashboard, Linkedin, Lock, LogOut, Mail, Menu, MessageSquare,
      Phone, Plus, Save, Settings, Shield, ShieldCheck, Star, Stethoscope, TrendingUp,
      Twitter, User, UserCircle, Users, X, Activity, Clock, MapPin, AlertCircle, CheckCircle,
      HeartPulse, Syringe, Thermometer, Trash2, Search, Ban, UserCheck, RefreshCw
    }))
  ]
};
