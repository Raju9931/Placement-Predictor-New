
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { StudentData } from '@/lib/types';
import { Card } from '@/components/ui/card';

interface StudentFormProps {
  onSubmitData: (data: StudentData) => void;
  isLoading?: boolean;
}

const StudentForm = ({ onSubmitData, isLoading = false }: StudentFormProps) => {
  const [formData, setFormData] = useState<StudentData>({
    name: '',
    gpa: 7.0,
    codingSkills: 5,
    communicationSkills: 5,
    projectCount: 2,
    internshipMonths: 0,
    certifications: 0,
    backlogs: 0,
    extraCurricular: 1,
    leadershipRoles: 0
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSliderChange = (name: string, value: number[]) => {
    setFormData((prev) => ({ ...prev, [name]: value[0] }));
  };
  
  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>, min: number, max: number) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10);
    
    if (isNaN(numValue)) {
      setFormData((prev) => ({ ...prev, [name]: min }));
      return;
    }
    
    const boundedValue = Math.min(Math.max(numValue, min), max);
    setFormData((prev) => ({ ...prev, [name]: boundedValue }));
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmitData(formData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleInputChange}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between">
                <Label htmlFor="gpa">GPA (0-10)</Label>
                <span className="text-sm font-medium">{formData.gpa.toFixed(1)}</span>
              </div>
              <Slider
                id="gpa"
                min={0}
                max={10}
                step={0.1}
                value={[formData.gpa]}
                onValueChange={(value) => handleSliderChange('gpa', value)}
                className="mt-2"
              />
            </div>
            
            <div>
              <div className="flex justify-between">
                <Label htmlFor="codingSkills">Coding Skills (1-10)</Label>
                <span className="text-sm font-medium">{formData.codingSkills}</span>
              </div>
              <Slider
                id="codingSkills"
                min={1}
                max={10}
                step={1}
                value={[formData.codingSkills]}
                onValueChange={(value) => handleSliderChange('codingSkills', value)}
                className="mt-2"
              />
            </div>
            
            <div>
              <div className="flex justify-between">
                <Label htmlFor="communicationSkills">Communication Skills (1-10)</Label>
                <span className="text-sm font-medium">{formData.communicationSkills}</span>
              </div>
              <Slider
                id="communicationSkills"
                min={1}
                max={10}
                step={1}
                value={[formData.communicationSkills]}
                onValueChange={(value) => handleSliderChange('communicationSkills', value)}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="projectCount">Number of Projects</Label>
              <Input
                id="projectCount"
                name="projectCount"
                type="number"
                min={0}
                max={15}
                value={formData.projectCount}
                onChange={(e) => handleNumberInputChange(e, 0, 15)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="internshipMonths">Internship Experience (in months)</Label>
              <Input
                id="internshipMonths"
                name="internshipMonths"
                type="number"
                min={0}
                max={24}
                value={formData.internshipMonths}
                onChange={(e) => handleNumberInputChange(e, 0, 24)}
                className="mt-1"
              />
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="certifications">Number of Relevant Certifications</Label>
              <Input
                id="certifications"
                name="certifications"
                type="number"
                min={0}
                max={10}
                value={formData.certifications}
                onChange={(e) => handleNumberInputChange(e, 0, 10)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="backlogs">Number of Academic Backlogs</Label>
              <Input
                id="backlogs"
                name="backlogs"
                type="number"
                min={0}
                max={10}
                value={formData.backlogs}
                onChange={(e) => handleNumberInputChange(e, 0, 10)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="extraCurricular">Extra-curricular Activities (1-10)</Label>
              <Input
                id="extraCurricular"
                name="extraCurricular"
                type="number"
                min={0}
                max={10}
                value={formData.extraCurricular}
                onChange={(e) => handleNumberInputChange(e, 0, 10)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="leadershipRoles">Leadership Roles</Label>
              <Input
                id="leadershipRoles"
                name="leadershipRoles"
                type="number"
                min={0}
                max={10}
                value={formData.leadershipRoles}
                onChange={(e) => handleNumberInputChange(e, 0, 10)}
                className="mt-1"
              />
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full bg-prediction-primary hover:bg-prediction-primary/90"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Get Placement Prediction'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </form>
  );
};

export default StudentForm;
