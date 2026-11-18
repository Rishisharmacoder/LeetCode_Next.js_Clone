import { getCurrentUserData } from '@/modules/profile/actions'
import PlaylistsSection from '@/modules/profile/components/playlist-section';
import ProfileStats from '@/modules/profile/components/profile-stats';
import SolvedProblems from '@/modules/profile/components/solved-problems';
import SubmissionsHistory from '@/modules/profile/components/submission-history';
import UserInfoCard from '@/modules/profile/components/user-info-card';

import React from 'react'

const ProfilePage = async() => {
    const profileData = await getCurrentUserData();

    console.log(profileData)

    if (!profileData || !("submissions" in profileData)) {
      return (
        <div className="min-h-screen py-32">
          <div className="container mx-auto px-4 max-w-7xl">
            <p className="text-center text-muted-foreground">
              Profile data is unavailable.
            </p>
          </div>
        </div>
      );
    }

    const submissions = profileData.submissions.map((submission) => ({
      ...submission,
      sourceCode:
        typeof submission.sourceCode === "string"
          ? submission.sourceCode
          : JSON.stringify(submission.sourceCode) ?? "",
    }));

  return (
   <div className="min-h-screen  py-32">
      <div className="container mx-auto px-4 max-w-7xl">
        <UserInfoCard
          userData={{
            ...profileData,
            firstName: profileData.firstName ?? "User",
            lastName: profileData.lastName ?? "",
          }}
        />

        <ProfileStats
          submissions={profileData.submissions}
          solvedCount={profileData.solvedProblems.length}
          playlistCount={profileData.playlists.length}
        />

        <SubmissionsHistory submissions={submissions} />

        <div className="grid  gap-8">
          <SolvedProblems solvedProblems={profileData.solvedProblems} />
          <PlaylistsSection playlists={profileData.playlists} />
        </div>
      </div>
    </div>
  )
}

export default ProfilePage;