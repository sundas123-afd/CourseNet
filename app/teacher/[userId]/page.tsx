'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, GraduationCap, User } from 'lucide-react';

interface TeacherInfo {
  _id: string;
  userId: string;
  fullName: string;
  bio: string;
  experience: number;
  expertise: string[];
  socialLinks?: string[];
  profileImage?: string;
  education?: string;
  phone?: string;
  email?: string;
}

const TeacherProfilePage = () => {
  const params = useParams();
  const [teacherInfo, setTeacherInfo] = useState<TeacherInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacherInfo = async () => {
      try {
        const response = await axios.get<TeacherInfo>(
          `/api/teacherInfo/${params.userId}`
        );
        setTeacherInfo(response.data);
      } catch (error) {
        console.error('Error fetching teacher profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.userId) {
      fetchTeacherInfo();
    }
  }, [params.userId]);

  if (loading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  if (!teacherInfo) {
    return <div className="container mx-auto p-6">Teacher not found</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={teacherInfo.profileImage} alt={teacherInfo.fullName} />
              <AvatarFallback className="text-2xl">
                {teacherInfo.fullName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-3xl">{teacherInfo.fullName}</CardTitle>
              <p className="text-muted-foreground mt-1">Teacher</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Bio
            </h3>
            <p className="text-muted-foreground">{teacherInfo.bio}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <GraduationCap className="w-5 h-5 mr-2" />
              Education
            </h3>
            <p className="text-muted-foreground">{teacherInfo.education || 'Not provided'}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Experience</h3>
            <p className="text-muted-foreground">{teacherInfo.experience} years</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {teacherInfo.expertise.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teacherInfo.email && (
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Email
                </h3>
                <p className="text-muted-foreground">{teacherInfo.email}</p>
              </div>
            )}

            {teacherInfo.phone && (
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Phone
                </h3>
                <p className="text-muted-foreground">{teacherInfo.phone}</p>
              </div>
            )}
          </div>

          {teacherInfo.socialLinks && teacherInfo.socialLinks.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Social Links</h3>
              <div className="flex flex-wrap gap-2">
                {teacherInfo.socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherProfilePage;
